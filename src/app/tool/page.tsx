'use client';

import { puzzlePieceDimensions, PieceDimensions, ConnectionPoint } from '@/config/puzzleDimensions';
import { useState } from 'react';

const SCALE_FACTOR = 0.2;

// The order for the grid: 1 2 3 4 (top), 5 6 7 8 (bottom)
const gridOrder = [1, 2, 3, 4, 5, 6, 7, 8];

function renderPieceId(id: number, showIds: boolean) {
    if (!showIds) return null;
    return (
        <div className="absolute left-1/2 -top-6 transform -translate-x-1/2 text-[10px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded">
            piece_{id}
        </div>
    );
}

function renderDot(point: ConnectionPoint, piece: PieceDimensions, showIds: boolean) {
    const DOT_SIZE = 24;
    // Since x,y are already relative to center in the config, just scale them
    const relativeX = point.x * SCALE_FACTOR;
    const relativeY = point.y * SCALE_FACTOR;

    return (
        <div
            key={`${point.id}-${point.type}`}
            className="relative"
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(${relativeX}px, ${relativeY}px)`,
                zIndex: 2,
            }}
        >
            {/* Label above the dot */}
            {showIds && (
                <div
                    className="absolute text-[8px] font-mono bg-black/80 text-white px-0.5 leading-tight rounded whitespace-nowrap"
                    style={{
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '8px', // Increased distance from dot
                    }}
                >
                    {point.id}
                </div>
            )}
            {/* The dot */}
            <div
                className={`rounded-full border-2 border-white shadow ${point.type === 'indent' ? 'bg-blue-500' : 'bg-red-500'}`}
                style={{
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    transform: `translate(-${DOT_SIZE / 2}px, -${DOT_SIZE / 2}px)`,
                    pointerEvents: 'none',
                }}
                title={`${point.type} connecting to piece ${point.connectsTo.pieceId} (${point.connectsTo.pointId})`}
            />
        </div>
    );
}

export default function PuzzleConfigTool() {
    const [showIds, setShowIds] = useState(true);

    // Arrange pieces in the specified grid order
    const pieces = gridOrder.map(id => puzzlePieceDimensions.find(p => p.id === id)).filter(Boolean) as PieceDimensions[];

    // Calculate container width based on the sum of the first row's widths
    const firstRowWidth = pieces.slice(0, 4).reduce((sum, piece) => sum + piece.width * SCALE_FACTOR, 0);
    const secondRowWidth = pieces.slice(4).reduce((sum, piece) => sum + piece.width * SCALE_FACTOR, 0);
    const containerWidth = Math.max(firstRowWidth, secondRowWidth);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto" style={{ maxWidth: containerWidth + 96 }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Puzzle Config Tool: Connection Points</h1>
                    <button
                        onClick={() => setShowIds(!showIds)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        {showIds ? 'Hide IDs' : 'Show IDs'}
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* First row */}
                    <div className="flex gap-8 mb-8">
                        {pieces.slice(0, 4).map((piece) => (
                            <div
                                key={piece.id}
                                className="relative"
                                style={{
                                    width: piece.width * SCALE_FACTOR,
                                    height: piece.height * SCALE_FACTOR,
                                }}
                            >
                                {renderPieceId(piece.id, showIds)}
                                <div
                                    className="relative w-full h-full"
                                    style={{
                                        outline: '2px solid black',
                                        outlineOffset: '2px',
                                        background: 'white',
                                    }}
                                >
                                    <img
                                        src={`/assets/puzzles/puzzle_1/${piece.id}.png`}
                                        alt={`Puzzle piece ${piece.id}`}
                                        className="w-full h-full select-none"
                                        draggable={false}
                                        style={{
                                            pointerEvents: 'none',
                                            objectFit: 'contain',
                                        }}
                                    />
                                    {piece.connections.map(point => renderDot(point, piece, showIds))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Second row */}
                    <div className="flex gap-8">
                        {pieces.slice(4).map((piece) => (
                            <div
                                key={piece.id}
                                className="relative"
                                style={{
                                    width: piece.width * SCALE_FACTOR,
                                    height: piece.height * SCALE_FACTOR,
                                }}
                            >
                                {renderPieceId(piece.id, showIds)}
                                <div
                                    className="relative w-full h-full"
                                    style={{
                                        outline: '2px solid black',
                                        outlineOffset: '2px',
                                        background: 'white',
                                    }}
                                >
                                    <img
                                        src={`/assets/puzzles/puzzle_1/${piece.id}.png`}
                                        alt={`Puzzle piece ${piece.id}`}
                                        className="w-full h-full select-none"
                                        draggable={false}
                                        style={{
                                            pointerEvents: 'none',
                                            objectFit: 'contain',
                                        }}
                                    />
                                    {piece.connections.map(point => renderDot(point, piece, showIds))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-center mt-4 text-gray-600">
                    Pieces are shown in grid order (top: 1 2 3 4, bottom: 5 6 7 8).<br />
                    Blue dots are indents, red dots are outdents. Hover over dots to see connections.<br />
                    Coordinates are relative to the center of each piece.
                </div>
            </div>
        </div>
    );
} 