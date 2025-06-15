'use client';

import { useState, useCallback, useEffect } from 'react';
import { puzzlePieceDimensions as initialPuzzleConfig, PieceDimensions, ConnectionPoint } from '../../config/puzzleDimensions';

const SCALE_FACTOR = 0.2;
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

export default function PuzzleGame() {
    const [puzzleConfig, setPuzzleConfig] = useState(initialPuzzleConfig);
    const [lastConfigUpdate, setLastConfigUpdate] = useState(Date.now());
    const [pieces, setPieces] = useState<PieceState[]>([]);

    useEffect(() => {
        const padding = 20;
        const startX = window.innerWidth * 0.1;
        const startY = window.innerHeight * 0.1;

        setPieces(puzzleConfig.map((piece, index) => {
            const adjustedIndex = piece.id - 1;
            const row = Math.floor(adjustedIndex / 4);
            const col = adjustedIndex % 4;

            // Calculate position with padding
            const x = startX + col * (piece.width * SCALE_FACTOR + padding);
            const y = startY + row * (piece.height * SCALE_FACTOR + padding);

            return {
                id: piece.id,
                x,
                y,
                groupId: `group-${piece.id}` // Initially each piece is in its own group
            };
        }));
    }, [puzzleConfig]);

    const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
    const [dragStartPos, setDragStartPos] = useState<Position>({ x: 0, y: 0 });

    // Poll for configuration updates
    useEffect(() => {
        const checkConfigUpdates = async () => {
            try {
                const response = await fetch('/api/puzzle-config');
                const newConfig = await response.json();

                // Compare with current config
                const configChanged = JSON.stringify(newConfig) !== JSON.stringify(puzzleConfig);

                if (configChanged) {
                    console.log('Puzzle configuration updated');
                    setPuzzleConfig(newConfig);
                    setLastConfigUpdate(Date.now());

                    // Update connection points for existing pieces
                    setPieces(currentPieces => {
                        return currentPieces.map(piece => {
                            const newPieceConfig = newConfig.find((p: PieceDimensions) => p.id === piece.id);
                            if (!newPieceConfig) return piece;

                            // If piece is part of a group, recalculate its position based on new connection points
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

    // Get the absolute position of a connection point for a piece
    const getConnectionPointPosition = (piece: PieceState, point: ConnectionPoint): Position => {
        const pieceData = puzzleConfig.find(p => p.id === piece.id)!;

        // Calculate the piece's center position
        const centerX = piece.x + (pieceData.width * SCALE_FACTOR) / 2;
        const centerY = piece.y + (pieceData.height * SCALE_FACTOR) / 2;

        // Apply the scaled offset from the center
        return {
            x: centerX + (point.x * SCALE_FACTOR),
            y: centerY + (point.y * SCALE_FACTOR)
        };
    };

    const arePointsClose = (p1: Position, p2: Position): boolean => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // First check if we're in the detection area
        if (distance < DETECTION_DISTANCE) {
            // If in detection area, check if we're close enough for actual connection
            if (distance < SNAP_DISTANCE) {
                return true;
            }

            // If in detection area but not close enough, add visual feedback
            // This is where you could add a "getting closer" visual effect
            return false;
        }

        return false;
    };

    const connectPieces = useCallback((piece1Id: number, piece2Id: number) => {
        setPieces(currentPieces => {
            const piece1 = currentPieces.find(p => p.id === piece1Id)!;
            const piece2 = currentPieces.find(p => p.id === piece2Id)!;
            const newGroupId = piece1.groupId;

            // Move all pieces from piece2's group to piece1's group
            return currentPieces.map(piece =>
                piece.groupId === piece2.groupId
                    ? { ...piece, groupId: newGroupId }
                    : piece
            );
        });
    }, []);

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

        // Move all pieces in the same group
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

        // Check for new connections
        checkConnections(draggedPiece);
    };

    const handleDragEnd = () => {
        setDraggedPiece(null);
    };

    // Get the absolute final position where pieces should connect
    const getFinalConnectionPosition = (
        piece1: PieceState,
        piece2: PieceState,
        point1: ConnectionPoint,
        point2: ConnectionPoint
    ): { piece1Pos: Position; piece2Pos: Position } => {
        const piece1Data = puzzleConfig.find(p => p.id === piece1.id)!;
        const piece2Data = puzzleConfig.find(p => p.id === piece2.id)!;

        // Calculate the absolute position where the connection should occur
        const connectionX = piece2.x + (piece2Data.width * SCALE_FACTOR / 2);
        const connectionY = piece2.y + (piece2Data.height * SCALE_FACTOR / 2);

        // Calculate the offset from each piece's center to the connection point
        const offset1X = point1.x * SCALE_FACTOR;
        const offset1Y = point1.y * SCALE_FACTOR;
        const offset2X = point2.x * SCALE_FACTOR;
        const offset2Y = point2.y * SCALE_FACTOR;

        // Calculate where piece1 should be positioned
        const piece1FinalX = connectionX - (piece1Data.width * SCALE_FACTOR / 2) - offset1X;
        const piece1FinalY = connectionY - (piece1Data.height * SCALE_FACTOR / 2) - offset1Y;

        // Calculate where piece2 should be positioned
        const piece2FinalX = connectionX - (piece2Data.width * SCALE_FACTOR / 2) - offset2X;
        const piece2FinalY = connectionY - (piece2Data.height * SCALE_FACTOR / 2) - offset2Y;

        return {
            piece1Pos: { x: piece1FinalX, y: piece1FinalY },
            piece2Pos: { x: piece2FinalX, y: piece2FinalY }
        };
    };

    const canConnect = (point: ConnectionPoint): boolean => {
        // Allow all connections
        return true;
    };

    // Calculate the final position for a new piece joining a group
    const calculateNewPiecePosition = (
        movingPiece: PieceState,
        anchorPiece: PieceState,
        movingPoint: ConnectionPoint,
        anchorPoint: ConnectionPoint
    ): Position => {
        const movingPieceData = puzzleConfig.find(p => p.id === movingPiece.id)!;
        const anchorPieceData = puzzleConfig.find(p => p.id === anchorPiece.id)!;

        // Calculate centers
        const anchorCenterX = anchorPiece.x + (anchorPieceData.width * SCALE_FACTOR / 2);
        const anchorCenterY = anchorPiece.y + (anchorPieceData.height * SCALE_FACTOR / 2);

        // Calculate the connection point on the anchor piece
        const anchorConnectionX = anchorCenterX + (anchorPoint.x * SCALE_FACTOR);
        const anchorConnectionY = anchorCenterY + (anchorPoint.y * SCALE_FACTOR);

        // Calculate the offset from the moving piece's connection point to its center
        const movingOffsetX = movingPoint.x * SCALE_FACTOR;
        const movingOffsetY = movingPoint.y * SCALE_FACTOR;

        // Calculate the final position for the moving piece
        return {
            x: anchorConnectionX - movingOffsetX - (movingPieceData.width * SCALE_FACTOR / 2),
            y: anchorConnectionY - movingOffsetY - (movingPieceData.height * SCALE_FACTOR / 2)
        };
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
                    // Determine which piece is in a larger group (has more connections)
                    const draggedGroupSize = pieces.filter(p => p.groupId === draggedPieceState.groupId).length;
                    const targetGroupSize = pieces.filter(p => p.groupId === targetPieceState.groupId).length;

                    let newPosition: Position;
                    const newGroupId = targetGroupSize >= draggedGroupSize ? targetPieceState.groupId : draggedPieceState.groupId;

                    if (targetGroupSize >= draggedGroupSize) {
                        // If target group is larger, move dragged piece to it
                        newPosition = calculateNewPiecePosition(draggedPieceState, targetPieceState, point, targetPoint);
                    } else {
                        // If dragged group is larger, move target piece to it
                        newPosition = calculateNewPiecePosition(targetPieceState, draggedPieceState, targetPoint, point);
                    }

                    // Update positions and group IDs
                    setPieces(currentPieces =>
                        currentPieces.map(piece => {
                            if (targetGroupSize >= draggedGroupSize) {
                                // Move dragged piece and its group to target
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
                                // Move target piece to dragged group
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
                }
            }
        });
    };

    return (
        <div
            className="min-h-screen bg-gray-800 relative overflow-hidden"
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
                            width: pieceData.width * SCALE_FACTOR,
                            height: pieceData.height * SCALE_FACTOR,
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
                            style={{}}
                        />
                    </div>
                );
            })}
        </div>
    );
} 