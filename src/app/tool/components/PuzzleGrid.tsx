import React from 'react';
import { PieceDimensions, ConnectionPoint } from '@/types';

interface SelectedPoint {
    pieceId: number;
    pointId: string;
}

interface PuzzleGridProps {
    pieces: PieceDimensions[];
    layout: { cols: number };
    scaleFactor: number;
    showIds: boolean;
    selectedPuzzleId: number;
    selectedPoint: SelectedPoint | null;
    linkingPoint: SelectedPoint | null;
    onPieceClick: (e: React.MouseEvent, piece: PieceDimensions) => void;
    onDotClick: (pieceId: number, pointId: string) => void;
}

function renderPieceId(id: number, showIds: boolean) {
    if (!showIds) return null;
    return (
        <div className="absolute left-1/2 -top-6 transform -translate-x-1/2 text-[10px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded">
            piece_{id}
        </div>
    );
}

function renderDot(
    point: ConnectionPoint,
    piece: PieceDimensions,
    isSelectedForEdit: boolean,
    isLinkingSource: boolean,
    onPointClick: (pieceId: number, pointId: string) => void,
    scaleFactor: number
) {
    const isIndent = point.type === 'indent';
    let dotColor = isIndent ? 'bg-blue-500' : 'bg-red-500';
    if (isSelectedForEdit) dotColor = 'bg-yellow-400';
    if (isLinkingSource) dotColor = 'bg-green-500 animate-pulse';

    const dotSize = isSelectedForEdit || isLinkingSource ? '12px' : '8px';
    const centerX = piece.width * scaleFactor / 2;
    const centerY = piece.height * scaleFactor / 2;

    return (
        <div
            key={point.id}
            className={`absolute rounded-full ${dotColor} cursor-pointer transform hover:scale-150 transition-transform`}
            style={{
                width: dotSize,
                height: dotSize,
                left: centerX + point.x * scaleFactor - parseInt(dotSize) / 2,
                top: centerY + point.y * scaleFactor - parseInt(dotSize) / 2,
                border: isSelectedForEdit ? '2px solid black' : 'none',
                zIndex: 10
            }}
            onClick={(e) => {
                e.stopPropagation();
                onPointClick(piece.id, point.id);
            }}
            title={`${point.id} (${point.x}, ${point.y}) -> piece_${point.connectsTo?.pieceId || 'unconnected'}${point.connectsTo.pointId ? ` (${point.connectsTo.pointId})` : ''}`}
        />
    );
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({
    pieces,
    layout,
    scaleFactor,
    showIds,
    selectedPuzzleId,
    selectedPoint,
    linkingPoint,
    onPieceClick,
    onDotClick,
}) => {
    return (
        <div className="grid gap-8" style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${layout.cols}, min-content)`,
            justifyContent: 'center',
            alignItems: 'start'
        }}>
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className="relative bg-gray-200 rounded-lg p-1 shadow-md hover:shadow-xl transition-shadow cursor-crosshair"
                    onClick={(e) => onPieceClick(e, piece)}
                    style={{
                        width: piece.width * scaleFactor,
                        height: piece.height * scaleFactor,
                    }}
                >
                    {renderPieceId(piece.id, showIds)}
                    <img
                        src={`/assets/puzzles/puzzle_${selectedPuzzleId}/${piece.id}.png`}
                        alt={`Piece ${piece.id}`}
                        className="w-full h-full object-contain pointer-events-none"
                    />
                    {piece.connections.map((point) =>
                        renderDot(
                            point,
                            piece,
                            selectedPoint?.pieceId === piece.id && selectedPoint?.pointId === point.id,
                            linkingPoint?.pieceId === piece.id && linkingPoint?.pointId === point.id,
                            onDotClick,
                            scaleFactor
                        )
                    )}
                </div>
            ))}
        </div>
    );
}; 