import React from 'react';
import { PieceDimensions, ConnectionPoint } from '@/types';

interface AllConnectionsPreviewProps {
    pieces: PieceDimensions[];
    connectionPairs: [number, number][];
    selectedPuzzleId: number;
    positionPieceRelativeTo: (
        piece: PieceDimensions,
        connection: ConnectionPoint,
        anchorPiece: PieceDimensions,
        anchorPos: { x: number, y: number }
    ) => { x: number, y: number } | null;
}

export const AllConnectionsPreview: React.FC<AllConnectionsPreviewProps> = ({
    pieces,
    connectionPairs,
    selectedPuzzleId,
    positionPieceRelativeTo,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">All Connections</h2>
                <p className="text-sm text-gray-500">
                    Showing {connectionPairs.length} unique two-way connections
                </p>
            </div>
            <div className="p-4 overflow-x-auto">
                <div className="flex flex-nowrap gap-4">
                    {connectionPairs.map(([id1, id2]) => {
                        const piece1 = pieces.find(p => p.id === id1);
                        const piece2 = pieces.find(p => p.id === id2);

                        if (!piece1 || !piece2) return null;

                        const connection2to1 = piece2.connections.find(c => c.connectsTo.pieceId === piece1.id);
                        if (!connection2to1) return null;

                        const pos1 = { x: 0, y: 0 };
                        const pos2 = positionPieceRelativeTo(piece2, connection2to1, piece1, pos1);
                        if (!pos2) return null;

                        const allX = [pos1.x, pos2.x, pos1.x + piece1.width, pos2.x + piece2.width];
                        const allY = [pos1.y, pos2.y, pos1.y + piece1.height, pos2.y + piece2.height];
                        const minX = Math.min(...allX);
                        const minY = Math.min(...allY);
                        const maxX = Math.max(...allX);
                        const maxY = Math.max(...allY);

                        const containerWidth = maxX - minX;
                        const containerHeight = maxY - minY;
                        const offsetX = -minX;
                        const offsetY = -minY;
                        const previewScale = 0.15;

                        return (
                            <div key={`${id1}-${id2}`} className="border rounded-lg p-2 bg-gray-50 relative flex-shrink-0" style={{ width: containerWidth * previewScale, height: containerHeight * previewScale }}>
                                <div className="absolute" style={{
                                    left: (pos1.x + offsetX) * previewScale,
                                    top: (pos1.y + offsetY) * previewScale,
                                    width: piece1.width * previewScale,
                                    height: piece1.height * previewScale
                                }}>
                                    <img src={`/assets/puzzles/puzzle_${selectedPuzzleId}/${piece1.id}.png`} alt={`Piece ${piece1.id}`} className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{
                                    left: (pos2.x + offsetX) * previewScale,
                                    top: (pos2.y + offsetY) * previewScale,
                                    width: piece2.width * previewScale,
                                    height: piece2.height * previewScale
                                }}>
                                    <img src={`/assets/puzzles/puzzle_${selectedPuzzleId}/${piece2.id}.png`} alt={`Piece ${piece2.id}`} className="w-full h-full" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}; 