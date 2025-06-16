'use client';

import { useState, useEffect } from 'react';
import { PuzzleConfig } from '@/types';

const SCALE_FACTOR = 0.2;

function renderPieceId(id: number, showIds: boolean) {
    if (!showIds) return null;
    return (
        <div className="absolute left-1/2 -top-6 transform -translate-x-1/2 text-[10px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded">
            piece_{id}
        </div>
    );
}

function renderDot(point: any, piece: any, showIds: boolean) {
    const isIndent = point.type === 'indent';
    const dotColor = isIndent ? 'bg-blue-500' : 'bg-red-500';
    const dotSize = '8px';

    const centerX = piece.width * SCALE_FACTOR / 2;
    const centerY = piece.height * SCALE_FACTOR / 2;

    return (
        <div
            key={point.id}
            className={`absolute rounded-full ${dotColor} cursor-help`}
            style={{
                width: dotSize,
                height: dotSize,
                left: centerX + point.x * SCALE_FACTOR - parseInt(dotSize) / 2,
                top: centerY + point.y * SCALE_FACTOR - parseInt(dotSize) / 2,
            }}
            title={`${point.id} (${point.x}, ${point.y}) -> piece_${point.connectsTo.pieceId}`}
        />
    );
}

export default function PuzzleConfigTool() {
    const [showIds, setShowIds] = useState(true);
    const [puzzleConfigs, setPuzzleConfigs] = useState<Record<number, PuzzleConfig>>({});
    const [selectedPuzzleId, setSelectedPuzzleId] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(true);

    // Load puzzle configurations dynamically
    useEffect(() => {
        async function loadPuzzleConfigs() {
            try {
                setIsLoading(true);
                // Import both configs dynamically
                const [puzzle1Module, puzzle2Module] = await Promise.all([
                    import('@/config/puzzle1Config'),
                    import('@/config/puzzle2Config')
                ]);
                setPuzzleConfigs({
                    1: puzzle1Module.puzzle1Config,
                    2: puzzle2Module.puzzle2Config
                });
            } catch (error) {
                console.error('Error loading puzzle configurations:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadPuzzleConfigs();
    }, []);

    if (isLoading || !puzzleConfigs[selectedPuzzleId]) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-600">Loading puzzle configurations...</div>
            </div>
        );
    }

    const selectedPuzzle = puzzleConfigs[selectedPuzzleId];

    // Sort pieces by ID to ensure correct order
    const pieces = [...selectedPuzzle.dimensions].sort((a, b) => a.id - b.id);

    // Calculate container width based on the sum of each row's widths
    const rowWidths = Array.from({ length: selectedPuzzle.layout.rows }, (_, rowIndex) => {
        const startIdx = rowIndex * selectedPuzzle.layout.cols;
        return pieces
            .slice(startIdx, startIdx + selectedPuzzle.layout.cols)
            .reduce((sum, piece) => sum + piece.width * SCALE_FACTOR, 0);
    });
    const containerWidth = Math.max(...rowWidths);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto" style={{ maxWidth: containerWidth + 96 }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Puzzle Config Tool: {selectedPuzzle.name}</h1>
                    <div className="flex gap-4">
                        <select
                            value={selectedPuzzleId}
                            onChange={(e) => setSelectedPuzzleId(parseInt(e.target.value))}
                            className="px-4 py-2 bg-white rounded-lg border border-gray-300"
                        >
                            <option value="1">Puzzle 1 (2x4)</option>
                            <option value="2">Puzzle 2 (4x4)</option>
                        </select>
                        <button
                            onClick={() => setShowIds(!showIds)}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            {showIds ? 'Hide IDs' : 'Show IDs'}
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col">
                    {/* Debug info */}
                    <div className="mb-4 text-sm font-mono bg-gray-100 p-2 rounded">
                        Pieces order: {pieces.map(p => p.id).join(', ')}
                    </div>
                    {/* Render rows based on layout */}
                    {Array.from({ length: selectedPuzzle.layout.rows }, (_, rowIndex) => {
                        const startIdx = rowIndex * selectedPuzzle.layout.cols;
                        const rowPieces = pieces.slice(startIdx, startIdx + selectedPuzzle.layout.cols);

                        return (
                            <div key={rowIndex} className="flex gap-8 mb-8 last:mb-0">
                                {/* Debug info for row */}
                                <div className="absolute -left-8 text-sm font-mono text-gray-500">
                                    Row {rowIndex}:
                                </div>
                                {rowPieces.map((piece) => (
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
                                                src={`/assets/puzzles/puzzle_${selectedPuzzle.id}/${piece.id}.png?v=${Date.now()}`}
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
                        );
                    })}
                </div>
                <div className="text-center mt-4 text-gray-600">
                    Pieces are shown in grid order ({selectedPuzzle.layout.rows}x{selectedPuzzle.layout.cols} grid).<br />
                    Blue dots are indents, red dots are outdents. Hover over dots to see connections.<br />
                    Coordinates are relative to the center of each piece.
                </div>
            </div>
        </div>
    );
} 