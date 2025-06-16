'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { puzzle1Config } from '@/config/puzzle1Config';
import { puzzle2Config } from '@/config/puzzle2Config';
import { PuzzleConfig, PieceDimensions, ConnectionPoint } from '@/types';

// Constants
const PADDING = 20;
const SNAP_DISTANCE = 30;
const CONFIG_POLL_INTERVAL = 1000;

interface Position {
    x: number;
    y: number;
}

interface PieceState extends Position {
    id: number;
    groupId: string;
}

interface PuzzleGameProps {
    onComplete?: () => void;
    className?: string;
    puzzleId: number;
    onTimeUpdate?: (time: number) => void;
}

export default function PuzzleGame({ onComplete, className = '', puzzleId, onTimeUpdate }: PuzzleGameProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scaleFactor, setScaleFactor] = useState(0.2);
    const [puzzleConfig, setPuzzleConfig] = useState<PuzzleConfig>(puzzleId === 1 ? puzzle1Config : puzzle2Config);
    const [lastConfigUpdate, setLastConfigUpdate] = useState(Date.now());
    const [pieces, setPieces] = useState<PieceState[]>([]);
    const draggedPieceRef = useRef<number | null>(null);
    const groupDragOffsetsRef = useRef<{ [id: number]: Position }>({});
    const [isCompleted, setIsCompleted] = useState(false);
    const startTimeRef = useRef<number | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const pendingConnectionCheckRef = useRef<number | null>(null);
    const checkConnectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const forceUpdate = useState({})[1];

    const clampGroupPosition = useCallback((groupPieces: PieceState[], containerWidth: number, containerHeight: number) => {
        if (groupPieces.length === 0) {
            return { dx: 0, dy: 0 };
        }

        const scaledPieces = groupPieces.map(p => {
            const pieceData = puzzleConfig.dimensions.find(pd => pd.id === p.id)!;
            return {
                ...p,
                width: pieceData.width * scaleFactor,
                height: pieceData.height * scaleFactor,
            };
        });

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        scaledPieces.forEach(p => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x + p.width);
            maxY = Math.max(maxY, p.y + p.height);
        });

        let dx = 0;
        let dy = 0;

        if (minX < 0) dx = -minX;
        else if (maxX > containerWidth) dx = containerWidth - maxX;

        if (minY < 0) dy = -minY;
        else if (maxY > containerHeight) dy = containerHeight - maxY;

        return { dx, dy };
    }, [puzzleConfig.dimensions, scaleFactor]);

    const stopTimer = useCallback(() => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        if (startTimeRef.current !== null) return;

        startTimeRef.current = Date.now();
        if (onTimeUpdate) {
            onTimeUpdate(0);
        }

        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }

        timerIntervalRef.current = setInterval(() => {
            if (startTimeRef.current) {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                if (onTimeUpdate) {
                    onTimeUpdate(elapsed);
                }
            }
        }, 1000);
    }, [onTimeUpdate]);

    // Calculate the total unscaled dimensions of the puzzle
    const calculatePuzzleDimensions = useCallback(() => {
        let maxWidth = 0;
        let totalHeight = 0;
        let currentRowHeight = 0;
        let currentRowWidth = 0;

        puzzleConfig.dimensions.forEach((piece, index) => {
            if (index > 0 && index % puzzleConfig.layout.cols === 0) {
                maxWidth = Math.max(maxWidth, currentRowWidth);
                totalHeight += currentRowHeight + PADDING;
                currentRowHeight = 0;
                currentRowWidth = 0;
            }
            currentRowWidth += piece.width + PADDING;
            currentRowHeight = Math.max(currentRowHeight, piece.height);
        });

        maxWidth = Math.max(maxWidth, currentRowWidth);
        totalHeight += currentRowHeight;

        return { width: maxWidth, height: totalHeight };
    }, [puzzleConfig]);

    const getAbsoluteConnectionPoint = (pieceState: PieceState, point: ConnectionPoint): Position => {
        const pieceData = puzzleConfig.dimensions.find(p => p.id === pieceState.id)!;
        return {
            x: pieceState.x + (pieceData.width / 2 + point.x) * scaleFactor,
            y: pieceState.y + (pieceData.height / 2 + point.y) * scaleFactor
        };
    };

    const handleDragStart = (e: React.MouseEvent, pieceId: number) => {
        if (isCompleted) return;
        startTimer();
        if (checkConnectionTimeoutRef.current) {
            clearTimeout(checkConnectionTimeoutRef.current);
        }
        draggedPieceRef.current = pieceId;
        // Find the group of the dragged piece
        const draggedPieceData = pieces.find(p => p.id === pieceId);
        if (!draggedPieceData) return;
        const groupId = draggedPieceData.groupId;
        // Store the offset between the mouse and each piece in the group
        const offsets: { [id: number]: Position } = {};
        pieces.forEach(piece => {
            if (piece.groupId === groupId) {
                offsets[piece.id] = {
                    x: e.clientX - piece.x,
                    y: e.clientY - piece.y
                };
            }
        });
        groupDragOffsetsRef.current = offsets;
        forceUpdate({});
    };

    const handleDrag = (e: React.MouseEvent) => {
        if (!draggedPieceRef.current) return;
        if (checkConnectionTimeoutRef.current) {
            clearTimeout(checkConnectionTimeoutRef.current);
        }
        const draggedPieceData = pieces.find(p => p.id === draggedPieceRef.current);
        if (!draggedPieceData || !containerRef.current) return;

        const groupId = draggedPieceData.groupId;
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const proposedGroupPieces = pieces
            .filter(p => p.groupId === groupId && groupDragOffsetsRef.current[p.id])
            .map(p => {
                return {
                    ...p,
                    x: e.clientX - groupDragOffsetsRef.current[p.id].x,
                    y: e.clientY - groupDragOffsetsRef.current[p.id].y,
                };
            });

        const { dx, dy } = clampGroupPosition(proposedGroupPieces, containerWidth, containerHeight);

        setPieces(currentPieces =>
            currentPieces.map(piece => {
                if (piece.groupId === groupId && groupDragOffsetsRef.current[piece.id]) {
                    return {
                        ...piece,
                        x: e.clientX - groupDragOffsetsRef.current[piece.id].x + dx,
                        y: e.clientY - groupDragOffsetsRef.current[piece.id].y + dy,
                    };
                }
                return piece;
            })
        );
    };

    const handleDragEnd = (e: React.MouseEvent) => {
        const draggedPieceId = draggedPieceRef.current;
        if (!draggedPieceId || !containerRef.current) return;

        const clientX = e.clientX;
        const clientY = e.clientY;

        const draggedPieceInfo = pieces.find(p => p.id === draggedPieceId);
        if (!draggedPieceInfo) return;
        const draggedGroupId = draggedPieceInfo.groupId;

        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Manually calculate the final positions of the dragged pieces using the mouseup event coordinates.
        // This avoids using stale state from the last mousemove event.
        let finalPieces = pieces.map(p => {
            if (p.groupId === draggedGroupId && groupDragOffsetsRef.current[p.id]) {
                return {
                    ...p,
                    x: clientX - groupDragOffsetsRef.current[p.id].x,
                    y: clientY - groupDragOffsetsRef.current[p.id].y,
                };
            }
            return p;
        });

        const draggedGroupPieces = finalPieces.filter(p => p.groupId === draggedGroupId);
        const { dx, dy } = clampGroupPosition(draggedGroupPieces, containerWidth, containerHeight);

        if (dx !== 0 || dy !== 0) {
            finalPieces = finalPieces.map(p => {
                if (p.groupId === draggedGroupId) {
                    return { ...p, x: p.x + dx, y: p.y + dy };
                }
                return p;
            });
        }

        // We can now clear the drag-related refs
        draggedPieceRef.current = null;
        groupDragOffsetsRef.current = {};
        forceUpdate({}); // To update dragging UI state

        const connectionResult = checkConnections(draggedPieceId, finalPieces);

        if (connectionResult) {
            const { targetGroupId, offset } = connectionResult;
            // Apply the connection offset to the calculated final positions
            const newPieces = finalPieces.map(p => {
                if (p.groupId === draggedGroupId) {
                    return {
                        ...p,
                        x: p.x + offset.x,
                        y: p.y + offset.y,
                        groupId: targetGroupId,
                    };
                }
                return p;
            });
            setPieces(newPieces);
        } else {
            // If no connection, just update with the final dragged position
            setPieces(finalPieces);
        }
    };

    const handleTouchStart = (e: React.TouchEvent, pieceId: number) => {
        if (isCompleted) return;
        startTimer();
        if (e.touches.length !== 1) return;
        const touch = e.touches[0];
        handleDragStart({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent, pieceId);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return;
        const touch = e.touches[0];
        handleDrag({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (e.changedTouches.length !== 1) return;
        const touch = e.changedTouches[0];
        handleDragEnd({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent);
    };

    const checkConnections = (pieceId: number, currentPieces: PieceState[]): {
        draggedGroupId: string;
        targetGroupId: string;
        offset: Position;
    } | null => {
        const draggedPieceData = puzzleConfig.dimensions.find(p => p.id === pieceId);
        const draggedPieceState = currentPieces.find(p => p.id === pieceId);
        if (!draggedPieceData || !draggedPieceState) return null;

        let bestMatch: {
            distance: number;
            dragPoint: ConnectionPoint;
            targetPiece: PieceDimensions;
            targetPieceState: PieceState;
            targetPoint: ConnectionPoint;
        } | null = null;

        // Find the best connection
        for (const dragPoint of draggedPieceData.connections) {
            const targetPiece = puzzleConfig.dimensions.find(p => p.id === dragPoint.connectsTo.pieceId);
            const targetPieceState = currentPieces.find(p => p.id === dragPoint.connectsTo.pieceId);

            if (!targetPiece || !targetPieceState || targetPieceState.groupId === draggedPieceState.groupId) continue;

            const targetPoint = targetPiece.connections.find(p => p.id === dragPoint.connectsTo.pointId);
            if (!targetPoint) continue;

            const dragPointPos = getAbsoluteConnectionPoint(draggedPieceState, dragPoint);
            const targetPointPos = getAbsoluteConnectionPoint(targetPieceState, targetPoint);

            const distance = Math.hypot(dragPointPos.x - targetPointPos.x, dragPointPos.y - targetPointPos.y);

            if (distance < SNAP_DISTANCE && (!bestMatch || distance < bestMatch.distance)) {
                bestMatch = {
                    distance,
                    dragPoint,
                    targetPiece,
                    targetPieceState,
                    targetPoint,
                };
            }
        }

        if (bestMatch !== null) {
            const { dragPoint, targetPieceState, targetPoint } = bestMatch;
            const dragPointAbs = getAbsoluteConnectionPoint(draggedPieceState, dragPoint);
            const targetPointAbs = getAbsoluteConnectionPoint(targetPieceState, targetPoint);
            const offset = {
                x: targetPointAbs.x - dragPointAbs.x,
                y: targetPointAbs.y - dragPointAbs.y
            };

            return {
                draggedGroupId: draggedPieceState.groupId,
                targetGroupId: targetPieceState.groupId,
                offset
            };
        }
        return null;
    };

    // Update scale factor when container size changes
    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (!containerRef.current) return;
            const container = containerRef.current;
            const { width: puzzleWidth, height: puzzleHeight } = calculatePuzzleDimensions();
            const widthScale = (container.clientWidth * 0.9) / puzzleWidth;
            const heightScale = (container.clientHeight * 0.9) / puzzleHeight;
            setScaleFactor(Math.min(widthScale, heightScale));
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [calculatePuzzleDimensions]);

    // Initialize pieces
    useEffect(() => {
        if (!containerRef.current || !scaleFactor) return;

        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const MIDDLE_GAP_WIDTH = containerWidth * 0.1; // 10% gap in the middle

        // A simple shuffle for the pieces
        const shuffledPiecesData = [...puzzleConfig.dimensions].sort(() => Math.random() - 0.5);
        const halfwayIndex = Math.ceil(shuffledPiecesData.length / 2);

        const newPieces = shuffledPiecesData.map((piece, index) => {
            const pieceWidth = piece.width * scaleFactor;
            const pieceHeight = piece.height * scaleFactor;

            let x: number;
            const y = PADDING + Math.random() * (containerHeight - pieceHeight - 2 * PADDING);

            if (index < halfwayIndex) {
                // Left side
                const leftAreaWidth = (containerWidth - MIDDLE_GAP_WIDTH) / 2;
                x = PADDING + Math.random() * (leftAreaWidth - pieceWidth - 2 * PADDING);
            } else {
                // Right side
                const rightAreaStart = (containerWidth + MIDDLE_GAP_WIDTH) / 2;
                const rightAreaWidth = (containerWidth - MIDDLE_GAP_WIDTH) / 2;
                x = rightAreaStart + PADDING + Math.random() * (rightAreaWidth - pieceWidth - 2 * PADDING);
            }

            return {
                id: piece.id,
                x,
                y,
                groupId: `group-${piece.id}`
            };
        });

        setPieces(newPieces);
    }, [puzzleConfig, scaleFactor]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const touchMoveHandler = (e: TouchEvent) => {
            if (draggedPieceRef.current) {
                e.preventDefault();
                handleTouchMove(e as any);
            }
        };

        const touchEndHandler = (e: TouchEvent) => {
            if (draggedPieceRef.current) {
                handleTouchEnd(e as any);
            }
        };

        container.addEventListener('touchmove', touchMoveHandler, { passive: false });
        container.addEventListener('touchend', touchEndHandler, { passive: false });
        container.addEventListener('touchcancel', touchEndHandler, { passive: false });

        return () => {
            container.removeEventListener('touchmove', touchMoveHandler);
            container.removeEventListener('touchend', touchEndHandler);
            container.removeEventListener('touchcancel', touchEndHandler);
        };
    }, [handleTouchMove, handleTouchEnd]);

    useEffect(() => {
        if (isCompleted || !containerRef.current) return;

        const allGroupIds = new Set(pieces.map(p => p.groupId));
        if (pieces.length > 0 && allGroupIds.size === 1) {
            stopTimer();

            const container = containerRef.current;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const scaledPieces = pieces.map(p => {
                const pieceData = puzzleConfig.dimensions.find(pd => pd.id === p.id)!;
                return {
                    ...p,
                    width: pieceData.width * scaleFactor,
                    height: pieceData.height * scaleFactor,
                };
            });

            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            scaledPieces.forEach(p => {
                minX = Math.min(minX, p.x);
                minY = Math.min(minY, p.y);
                maxX = Math.max(maxX, p.x + p.width);
                maxY = Math.max(maxY, p.y + p.height);
            });

            const puzzleWidth = maxX - minX;
            const puzzleHeight = maxY - minY;
            const targetX = (containerWidth - puzzleWidth) / 2;
            const targetY = (containerHeight - puzzleHeight) / 2;
            const dx = targetX - minX;
            const dy = targetY - minY;

            const centeredPieces = pieces.map(p => ({
                ...p,
                x: p.x + dx,
                y: p.y + dy,
            }));

            setPieces(centeredPieces);
            setIsCompleted(true);

            if (onComplete) {
                onComplete();
            }
        }
    }, [pieces, onComplete, isCompleted, puzzleConfig.dimensions, scaleFactor, stopTimer]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopTimer();
        };
    }, [stopTimer]);

    return (
        <div
            ref={containerRef}
            className={`h-full bg-gray-800 relative overflow-hidden ${className}`}
            onMouseMove={e => draggedPieceRef.current && handleDrag(e)}
            onMouseUp={e => handleDragEnd(e)}
            onMouseLeave={e => handleDragEnd(e)}
        >
            {pieces.map(piece => {
                const pieceData = puzzleConfig.dimensions.find(p => p.id === piece.id)!;
                const isDragging = draggedPieceRef.current !== null && pieces.find(p => p.id === draggedPieceRef.current)?.groupId === piece.groupId;

                return (
                    <div
                        key={piece.id}
                        className={`absolute select-none ${isCompleted ? 'cursor-default' : 'cursor-move'}`}
                        style={{
                            width: pieceData.width * scaleFactor,
                            height: pieceData.height * scaleFactor,
                            left: piece.x,
                            top: piece.y,
                            transition: isCompleted ? 'left 0.5s ease-in-out, top 0.5s ease-in-out' : 'none',
                            zIndex: isDragging ? 10 : 1,
                        }}
                        onMouseDown={e => handleDragStart(e, piece.id)}
                        onTouchStart={e => handleTouchStart(e, piece.id)}
                    >
                        <img
                            src={`/assets/puzzles/puzzle_${puzzleId}/${piece.id}.png`}
                            alt={`Puzzle piece ${piece.id}`}
                            className="w-full h-full pointer-events-none"
                            draggable={false}
                        />
                    </div>
                );
            })}
        </div>
    );
}