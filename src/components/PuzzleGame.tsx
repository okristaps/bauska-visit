'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { puzzlePieceDimensions as initialPuzzleConfig, PieceDimensions, ConnectionPoint } from '../config/puzzleDimensions';

// Calculate initial dimensions of the puzzle
const TOTAL_ROWS = 2;
const TOTAL_COLS = 4;
const PADDING = 20;
const DETECTION_DISTANCE = 25;
const SNAP_DISTANCE = 8;
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
}

export default function PuzzleGame({ onComplete, className = '' }: PuzzleGameProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scaleFactor, setScaleFactor] = useState(0.2);
    const [puzzleConfig, setPuzzleConfig] = useState(initialPuzzleConfig);
    const [lastConfigUpdate, setLastConfigUpdate] = useState(Date.now());
    const [pieces, setPieces] = useState<PieceState[]>([]);
    const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
    const [dragStartPos, setDragStartPos] = useState<Position>({ x: 0, y: 0 });

    // Calculate the total unscaled dimensions of the puzzle
    const calculatePuzzleDimensions = useCallback(() => {
        let maxRowWidth = 0;
        let maxRowHeight = 0;
        let totalHeight = 0;

        // Calculate dimensions for each row
        for (let row = 0; row < TOTAL_ROWS; row++) {
            let rowWidth = 0;
            let rowHeight = 0;

            // Calculate dimensions for each piece in the row
            for (let col = 0; col < TOTAL_COLS; col++) {
                const pieceIndex = row * TOTAL_COLS + col;
                const piece = puzzleConfig[pieceIndex];
                if (piece) {
                    rowWidth += piece.width + PADDING;
                    rowHeight = Math.max(rowHeight, piece.height);
                }
            }

            maxRowWidth = Math.max(maxRowWidth, rowWidth);
            maxRowHeight = Math.max(maxRowHeight, rowHeight);
            totalHeight += rowHeight + PADDING;
        }

        return {
            width: maxRowWidth - PADDING, // Remove extra padding
            height: totalHeight - PADDING // Remove extra padding
        };
    }, [puzzleConfig]);

    // Calculate scale factor based on container size
    const updateScaleFactor = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const { width: puzzleWidth, height: puzzleHeight } = calculatePuzzleDimensions();
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calculate scale factors for both dimensions
        const widthScale = (containerWidth * 0.9) / puzzleWidth; // Leave 10% margin
        const heightScale = (containerHeight * 0.9) / puzzleHeight; // Leave 10% margin

        // Use the smaller scale to ensure puzzle fits both dimensions
        const newScaleFactor = Math.min(widthScale, heightScale);
        setScaleFactor(newScaleFactor);
    }, [calculatePuzzleDimensions]);

    // Update scale factor when container size changes
    useEffect(() => {
        const observer = new ResizeObserver(() => {
            updateScaleFactor();
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [updateScaleFactor]);

    // Initialize pieces with the current config
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const { width: puzzleWidth, height: puzzleHeight } = calculatePuzzleDimensions();

        // Calculate starting position to center the puzzle
        const startX = (container.clientWidth - puzzleWidth * scaleFactor) / 2;
        const startY = (container.clientHeight - puzzleHeight * scaleFactor) / 2;

        setPieces(puzzleConfig.map((piece, index) => {
            const adjustedIndex = piece.id - 1;
            const row = Math.floor(adjustedIndex / TOTAL_COLS);
            const col = adjustedIndex % TOTAL_COLS;

            // Calculate position with padding
            let x = startX;
            let y = startY;

            // Add up widths of all pieces before this one in the row
            for (let i = 0; i < col; i++) {
                const prevPiece = puzzleConfig[row * TOTAL_COLS + i];
                if (prevPiece) {
                    x += (prevPiece.width + PADDING) * scaleFactor;
                }
            }

            // Add up heights of all rows before this one
            for (let i = 0; i < row; i++) {
                let maxRowHeight = 0;
                for (let j = 0; j < TOTAL_COLS; j++) {
                    const piece = puzzleConfig[i * TOTAL_COLS + j];
                    if (piece) {
                        maxRowHeight = Math.max(maxRowHeight, piece.height);
                    }
                }
                y += (maxRowHeight + PADDING) * scaleFactor;
            }

            return {
                id: piece.id,
                x,
                y,
                groupId: `group-${piece.id}`
            };
        }));
    }, [puzzleConfig, scaleFactor, calculatePuzzleDimensions]);

    useEffect(() => {
        const checkConfigUpdates = async () => {
            try {
                const response = await fetch('/api/puzzle-config');
                const newConfig = await response.json();
                const configChanged = JSON.stringify(newConfig) !== JSON.stringify(puzzleConfig);

                if (configChanged) {
                    console.log('Puzzle configuration updated');
                    setPuzzleConfig(newConfig);
                    setLastConfigUpdate(Date.now());

                    setPieces(currentPieces => {
                        return currentPieces.map(piece => {
                            const newPieceConfig = newConfig.find((p: PieceDimensions) => p.id === piece.id);
                            if (!newPieceConfig) return piece;

                            if (piece.groupId !== `group-${piece.id}`) {
                                const groupMainPiece = currentPieces.find(p => p.groupId === piece.groupId && p.id !== piece.id);
                                if (groupMainPiece) {
                                    const connection = newPieceConfig.connections.find(
                                        (conn: ConnectionPoint) => conn.connectsTo.pieceId === groupMainPiece.id
                                    );
                                    if (connection) {
                                        const mainPieceConfig = newConfig.find((p: PieceDimensions) => p.id === groupMainPiece.id);
                                        if (mainPieceConfig) {
                                            const targetConnection = mainPieceConfig.connections.find(
                                                (conn: ConnectionPoint) => conn.connectsTo.pieceId === piece.id
                                            );
                                            if (targetConnection) {
                                                const newPos = calculateNewPiecePosition(
                                                    piece,
                                                    groupMainPiece,
                                                    connection,
                                                    targetConnection
                                                );
                                                return {
                                                    ...piece,
                                                    x: newPos.x,
                                                    y: newPos.y
                                                };
                                            }
                                        }
                                    }
                                }
                            }
                            return piece;
                        });
                    });
                }
            } catch (error) {
                console.error('Error checking for config updates:', error);
            }
        };

        const pollInterval = setInterval(checkConfigUpdates, CONFIG_POLL_INTERVAL);
        return () => clearInterval(pollInterval);
    }, [puzzleConfig, lastConfigUpdate]);

    const getConnectionPointPosition = (piece: PieceState, point: ConnectionPoint): Position => {
        const pieceData = puzzleConfig.find(p => p.id === piece.id)!;
        const centerX = piece.x + (pieceData.width * scaleFactor) / 2;
        const centerY = piece.y + (pieceData.height * scaleFactor) / 2;

        return {
            x: centerX + (point.x * scaleFactor),
            y: centerY + (point.y * scaleFactor)
        };
    };

    const canConnect = (point: ConnectionPoint): boolean => {
        return true;
    };

    const calculateNewPiecePosition = (
        movingPiece: PieceState,
        anchorPiece: PieceState,
        movingPoint: ConnectionPoint,
        anchorPoint: ConnectionPoint
    ): Position => {
        const movingPieceData = puzzleConfig.find(p => p.id === movingPiece.id)!;
        const anchorPieceData = puzzleConfig.find(p => p.id === anchorPiece.id)!;

        const anchorCenterX = anchorPiece.x + (anchorPieceData.width * scaleFactor) / 2;
        const anchorCenterY = anchorPiece.y + (anchorPieceData.height * scaleFactor) / 2;

        const anchorConnectionX = anchorCenterX + (anchorPoint.x * scaleFactor);
        const anchorConnectionY = anchorCenterY + (anchorPoint.y * scaleFactor);

        const movingOffsetX = movingPoint.x * scaleFactor;
        const movingOffsetY = movingPoint.y * scaleFactor;

        return {
            x: anchorConnectionX - movingOffsetX - (movingPieceData.width * scaleFactor) / 2,
            y: anchorConnectionY - movingOffsetY - (movingPieceData.height * scaleFactor) / 2
        };
    };

    const handleDragStart = (e: React.MouseEvent, pieceId: number, pieceX: number, pieceY: number) => {
        setDraggedPiece(pieceId);
        setDragOffset({
            x: e.clientX - pieceX,
            y: e.clientY - pieceY
        });
        setDragStartPos({ x: pieceX, y: pieceY });
    };

    const handleDrag = (e: React.MouseEvent) => {
        if (!draggedPiece) return;

        const draggedPieceData = pieces.find(p => p.id === draggedPiece)!;
        const deltaX = e.clientX - dragOffset.x - dragStartPos.x;
        const deltaY = e.clientY - dragOffset.y - dragStartPos.y;

        setPieces(currentPieces =>
            currentPieces.map(piece =>
                piece.groupId === draggedPieceData.groupId
                    ? {
                        ...piece,
                        x: piece.x + deltaX,
                        y: piece.y + deltaY
                    }
                    : piece
            )
        );

        setDragStartPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
        checkConnections(draggedPiece);
    };

    const handleDragEnd = () => {
        setDraggedPiece(null);
    };

    const checkConnections = (pieceId: number) => {
        const draggedPieceData = puzzleConfig.find(p => p.id === pieceId);
        const draggedPieceState = pieces.find(p => p.id === pieceId);
        if (!draggedPieceData || !draggedPieceState) return;

        draggedPieceData.connections.forEach(point => {
            const targetPiece = puzzleConfig.find(p => p.id === point.connectsTo.pieceId);
            const targetPieceState = pieces.find(p => p.id === point.connectsTo.pieceId);

            if (!targetPiece || !targetPieceState || targetPieceState.groupId === draggedPieceState.groupId) return;

            const targetPoint = targetPiece.connections.find(p => p.id === point.connectsTo.pointId);
            if (!targetPoint) return;

            const pointPos = getConnectionPointPosition(draggedPieceState, point);
            const targetPos = getConnectionPointPosition(targetPieceState, targetPoint);

            const dx = pointPos.x - targetPos.x;
            const dy = pointPos.y - targetPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < DETECTION_DISTANCE) {
                if (distance < SNAP_DISTANCE) {
                    const draggedGroupSize = pieces.filter(p => p.groupId === draggedPieceState.groupId).length;
                    const targetGroupSize = pieces.filter(p => p.groupId === targetPieceState.groupId).length;

                    let newPosition: Position;
                    const newGroupId = targetGroupSize >= draggedGroupSize ? targetPieceState.groupId : draggedPieceState.groupId;

                    if (targetGroupSize >= draggedGroupSize) {
                        newPosition = calculateNewPiecePosition(draggedPieceState, targetPieceState, point, targetPoint);
                    } else {
                        newPosition = calculateNewPiecePosition(targetPieceState, draggedPieceState, targetPoint, point);
                    }

                    setPieces(currentPieces =>
                        currentPieces.map(piece => {
                            if (targetGroupSize >= draggedGroupSize) {
                                if (piece.groupId === draggedPieceState.groupId) {
                                    const offsetX = newPosition.x - draggedPieceState.x;
                                    const offsetY = newPosition.y - draggedPieceState.y;
                                    return {
                                        ...piece,
                                        x: piece.x + offsetX,
                                        y: piece.y + offsetY,
                                        groupId: newGroupId
                                    };
                                }
                            } else {
                                if (piece.groupId === targetPieceState.groupId) {
                                    const offsetX = newPosition.x - targetPieceState.x;
                                    const offsetY = newPosition.y - targetPieceState.y;
                                    return {
                                        ...piece,
                                        x: piece.x + offsetX,
                                        y: piece.y + offsetY,
                                        groupId: newGroupId
                                    };
                                }
                            }
                            return piece;
                        })
                    );

                    // Check if puzzle is complete
                    const uniqueGroups = new Set(pieces.map(p => p.groupId));
                    if (uniqueGroups.size === 1 && onComplete) {
                        onComplete();
                    }
                }
            }
        });
    };

    return (
        <div
            ref={containerRef}
            className={`h-full bg-gray-800 relative overflow-hidden ${className}`}
            onMouseMove={e => draggedPiece && handleDrag(e)}
            onMouseUp={() => handleDragEnd()}
        >
            {pieces.map(piece => {
                const pieceData = puzzleConfig.find(p => p.id === piece.id)!;
                const isDraggingGroup = draggedPiece !== null &&
                    pieces.find(p => p.id === draggedPiece)?.groupId === piece.groupId;

                return (
                    <div
                        key={piece.id}
                        className="absolute cursor-move select-none"
                        style={{
                            width: pieceData.width * scaleFactor,
                            height: pieceData.height * scaleFactor,
                            left: piece.x,
                            top: piece.y,
                            transition: isDraggingGroup ? 'none' : 'all 0.3s ease',
                            zIndex: isDraggingGroup ? 10 : 1,
                        }}
                        onMouseDown={e => handleDragStart(e, piece.id, piece.x, piece.y)}
                    >
                        <img
                            src={`/assets/puzzles/puzzle_1/${piece.id}.png`}
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