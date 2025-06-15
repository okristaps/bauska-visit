'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { puzzle1Config } from '@/config/puzzle1Config';
import { puzzle2Config } from '@/config/puzzle2Config';
import { PuzzleConfig, PieceDimensions, ConnectionPoint } from '@/types';

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
    puzzleId: number;
}

export default function PuzzleGame({ onComplete, className = '', puzzleId }: PuzzleGameProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scaleFactor, setScaleFactor] = useState(0.2);
    const [puzzleConfig, setPuzzleConfig] = useState<PuzzleConfig>(puzzleId === 1 ? puzzle1Config : puzzle2Config);
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
        for (let row = 0; row < puzzleConfig.layout.rows; row++) {
            let rowWidth = 0;
            let rowHeight = 0;

            // Calculate dimensions for each piece in the row
            for (let col = 0; col < puzzleConfig.layout.cols; col++) {
                const pieceIndex = row * puzzleConfig.layout.cols + col;
                const piece = puzzleConfig.dimensions[pieceIndex];
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

        setPieces(puzzleConfig.dimensions.map((piece: PieceDimensions, index: number) => {
            const adjustedIndex = piece.id - 1;
            const row = Math.floor(adjustedIndex / puzzleConfig.layout.cols);
            const col = adjustedIndex % puzzleConfig.layout.cols;

            // Calculate position with padding
            let x = startX;
            let y = startY;

            // Add up widths of all pieces before this one in the row
            for (let i = 0; i < col; i++) {
                const prevPiece = puzzleConfig.dimensions[row * puzzleConfig.layout.cols + i];
                if (prevPiece) {
                    x += (prevPiece.width + PADDING) * scaleFactor;
                }
            }

            // Add up heights of all rows before this one
            for (let i = 0; i < row; i++) {
                let maxRowHeight = 0;
                for (let j = 0; j < puzzleConfig.layout.cols; j++) {
                    const piece = puzzleConfig.dimensions[i * puzzleConfig.layout.cols + j];
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
                const response = await fetch(`/api/puzzle-config?puzzleId=${puzzleId}`);
                const newConfig = await response.json();
                const configChanged = JSON.stringify(newConfig) !== JSON.stringify(puzzleConfig);

                if (configChanged) {
                    console.log('Puzzle configuration updated');
                    setPuzzleConfig(newConfig);
                    setLastConfigUpdate(Date.now());
                }
            } catch (error) {
                console.error('Error checking for config updates:', error);
            }
        };

        const pollInterval = setInterval(checkConfigUpdates, CONFIG_POLL_INTERVAL);
        return () => clearInterval(pollInterval);
    }, [puzzleConfig, lastConfigUpdate, puzzleId]);

    const getConnectionPointPosition = (piece: PieceState, point: ConnectionPoint): Position => {
        const pieceData = puzzleConfig.dimensions.find((p: PieceDimensions) => p.id === piece.id)!;
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
        const movingPieceData = puzzleConfig.dimensions.find((p: PieceDimensions) => p.id === movingPiece.id)!;
        const anchorPieceData = puzzleConfig.dimensions.find((p: PieceDimensions) => p.id === anchorPiece.id)!;

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
        const draggedPieceData = puzzleConfig.dimensions.find(p => p.id === pieceId);
        const draggedPieceState = pieces.find(p => p.id === pieceId);
        if (!draggedPieceData || !draggedPieceState) return;

        draggedPieceData.connections.forEach(point => {
            const targetPiece = puzzleConfig.dimensions.find(p => p.id === point.connectsTo.pieceId);
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
                const pieceData = puzzleConfig.dimensions.find(p => p.id === piece.id)!;
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