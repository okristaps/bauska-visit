import React from 'react';
import { PuzzleConfig, ConnectionPoint, PieceDimensions } from '@/types';

interface SelectedPoint {
    pieceId: number;
    pointId: string;
}

interface ConnectionPreviewProps {
    selectedPoint: SelectedPoint | null;
    linkingPoint: SelectedPoint | null;
    addingPointType: 'indent' | 'outdent' | null;
    selectedPuzzle: PuzzleConfig;
    selectedPuzzleId: number;
    positionPieceRelativeTo: (
        piece: PieceDimensions,
        connection: ConnectionPoint,
        anchorPiece: PieceDimensions,
        anchorPos: { x: number, y: number }
    ) => { x: number, y: number } | null;
}

const StatusText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-center justify-center h-full text-gray-500 text-center p-4">
        {children}
    </div>
);


export const ConnectionPreview: React.FC<ConnectionPreviewProps> = ({
    selectedPoint,
    linkingPoint,
    addingPointType,
    selectedPuzzle,
    selectedPuzzleId,
    positionPieceRelativeTo
}) => {
    const getStatusMessage = () => {
        if (linkingPoint) {
            return `LINKING: From piece ${linkingPoint.pieceId} (${linkingPoint.pointId}). Click target point.`;
        }
        if (selectedPoint) {
            return `Selected: Piece ${selectedPoint.pieceId}, Point ${selectedPoint.pointId}`;
        }
        if (addingPointType) {
            return `Click on a piece to add a new ${addingPointType} point.`;
        }
        return 'Select a point to see connection details.';
    };

    const renderPreview = () => {
        if (!selectedPoint) {
            return <StatusText>Select a connection point to see a preview.</StatusText>;
        }

        const piece1 = selectedPuzzle.dimensions.find(p => p.id === selectedPoint.pieceId);
        if (!piece1) return null;

        const connection1 = piece1.connections.find(c => c.id === selectedPoint.pointId);
        if (!connection1 || connection1.connectsTo.pieceId === 0) {
            return <StatusText>This point is not connected to another piece.</StatusText>;
        }

        const piece2 = selectedPuzzle.dimensions.find(p => p.id === connection1.connectsTo.pieceId);
        if (!piece2) return <StatusText>Connected piece not found.</StatusText>;

        const connection2 = piece2.connections.find(c => c.connectsTo.pieceId === piece1.id && c.connectsTo.pointId === connection1.id);
        if (!connection2) {
            return <StatusText>This is a one-way connection. Cannot preview.</StatusText>;
        }

        const pos1 = { x: 0, y: 0 };
        const pos2 = positionPieceRelativeTo(piece2, connection2, piece1, pos1);
        if (!pos2) return <StatusText>Could not calculate relative position.</StatusText>;

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

        const previewWidth = 300;
        const previewHeight = 300;

        let previewScale = 1;
        if (containerWidth > 0 && containerHeight > 0) {
            const scaleX = previewWidth / containerWidth;
            const scaleY = previewHeight / containerHeight;
            previewScale = Math.min(scaleX, scaleY) * 0.9;
        }

        return (
            <div className="w-full h-full flex items-center justify-center">
                <div key={`${piece1.id}-${piece2.id}`} className="relative" style={{ width: containerWidth * previewScale, height: containerHeight * previewScale }}>
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
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-lg flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">Connection Preview</h2>
                <p className="text-sm text-gray-500 h-10 flex items-center">{getStatusMessage()}</p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-b-xl p-4 flex items-center justify-center min-h-[300px]">
                {renderPreview()}
            </div>
        </div>
    );
}; 