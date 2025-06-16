'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PuzzleConfig, ConnectionPoint } from '@/types';

const ARROW_KEY_MOVE_AMOUNT = 5;

interface SelectedPoint {
    pieceId: number;
    pointId: string;
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
    piece: any,
    showIds: boolean,
    isSelected: boolean,
    onPointClick: (pieceId: number, pointId: string) => void,
    scaleFactor: number
) {
    const isIndent = point.type === 'indent';
    const dotColor = isSelected ? 'bg-yellow-400' : (isIndent ? 'bg-blue-500' : 'bg-red-500');
    const dotSize = isSelected ? '12px' : '8px';

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
                border: isSelected ? '2px solid black' : 'none',
            }}
            onClick={() => onPointClick(piece.id, point.id)}
            title={`${point.id} (${point.x}, ${point.y}) -> piece_${point.connectsTo?.pieceId || 'unconnected'}`}
        />
    );
}

export default function PuzzleConfigTool() {
    const [showIds, setShowIds] = useState(true);
    const [puzzleConfigs, setPuzzleConfigs] = useState<Record<number, PuzzleConfig>>({});
    const [selectedPuzzleId, setSelectedPuzzleId] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
    const [addingPointType, setAddingPointType] = useState<'indent' | 'outdent' | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [scaleFactor, setScaleFactor] = useState(0.2);
    const [copySuccess, setCopySuccess] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate the total unscaled dimensions of the puzzle
    const calculatePuzzleDimensions = useCallback((config: PuzzleConfig) => {
        let maxRowWidth = 0;
        let maxRowHeight = 0;
        let totalHeight = 0;

        // Calculate dimensions for each row
        for (let row = 0; row < config.layout.rows; row++) {
            let rowWidth = 0;
            let rowHeight = 0;

            // Calculate dimensions for each piece in the row
            for (let col = 0; col < config.layout.cols; col++) {
                const pieceIndex = row * config.layout.cols + col;
                const piece = config.dimensions[pieceIndex];
                if (piece) {
                    rowWidth += piece.width + 20; // 20px padding
                    rowHeight = Math.max(rowHeight, piece.height);
                }
            }

            maxRowWidth = Math.max(maxRowWidth, rowWidth);
            maxRowHeight = Math.max(maxRowHeight, rowHeight);
            totalHeight += rowHeight + 20; // 20px padding
        }

        return {
            width: maxRowWidth - 20, // Remove extra padding
            height: totalHeight - 20 // Remove extra padding
        };
    }, []);

    // Update scale factor when container size changes
    const updateScaleFactor = useCallback(() => {
        if (!containerRef.current || !puzzleConfigs[selectedPuzzleId]) return;

        const container = containerRef.current;
        const { width: puzzleWidth, height: puzzleHeight } = calculatePuzzleDimensions(puzzleConfigs[selectedPuzzleId]);
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calculate scale factors for both dimensions
        const widthScale = (containerWidth * 0.9) / puzzleWidth; // Leave 10% margin
        const heightScale = (containerHeight * 0.9) / puzzleHeight; // Leave 10% margin

        // Use the smaller scale to ensure puzzle fits both dimensions
        const newScaleFactor = Math.min(widthScale, heightScale, 0.2); // Cap at 0.2 to prevent pieces from being too large
        setScaleFactor(newScaleFactor);
    }, [calculatePuzzleDimensions, puzzleConfigs, selectedPuzzleId]);

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

    // Load puzzle configurations dynamically
    useEffect(() => {
        async function loadPuzzleConfigs() {
            try {
                setIsLoading(true);
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

    const handlePointClick = useCallback((pieceId: number, pointId: string) => {
        setSelectedPoint({ pieceId, pointId });
        setAddingPointType(null);
    }, []);

    const handlePieceClick = useCallback((e: React.MouseEvent, piece: any) => {
        if (!addingPointType) return;

        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / scaleFactor - piece.width / 2;
        const y = (e.clientY - rect.top) / scaleFactor - piece.height / 2;

        const newPoint: ConnectionPoint = {
            id: `${addingPointType}_${piece.id}_${piece.connections.length + 1}`,
            type: addingPointType,
            x: Math.round(x),
            y: Math.round(y),
            connectsTo: { pieceId: 0, pointId: '', sequence: 1 }
        };

        const updatedConfig = { ...puzzleConfigs[selectedPuzzleId] };
        const pieceIndex = updatedConfig.dimensions.findIndex(p => p.id === piece.id);
        updatedConfig.dimensions[pieceIndex].connections.push(newPoint);

        setPuzzleConfigs({ ...puzzleConfigs, [selectedPuzzleId]: updatedConfig });
        setAddingPointType(null);
    }, [addingPointType, puzzleConfigs, selectedPuzzleId, scaleFactor]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!selectedPoint) return;

        const updatedConfig = { ...puzzleConfigs[selectedPuzzleId] };
        const piece = updatedConfig.dimensions.find(p => p.id === selectedPoint.pieceId);
        if (!piece) return;

        const point = piece.connections.find(p => p.id === selectedPoint.pointId);
        if (!point) return;

        switch (e.key) {
            case 'ArrowLeft':
                point.x -= ARROW_KEY_MOVE_AMOUNT;
                break;
            case 'ArrowRight':
                point.x += ARROW_KEY_MOVE_AMOUNT;
                break;
            case 'ArrowUp':
                point.y -= ARROW_KEY_MOVE_AMOUNT;
                break;
            case 'ArrowDown':
                point.y += ARROW_KEY_MOVE_AMOUNT;
                break;
            case 'Delete':
            case 'Backspace':
                const pieceIndex = updatedConfig.dimensions.findIndex(p => p.id === selectedPoint.pieceId);
                updatedConfig.dimensions[pieceIndex].connections = piece.connections.filter(p => p.id !== selectedPoint.pointId);
                setSelectedPoint(null);
                break;
            default:
                return;
        }

        setPuzzleConfigs({ ...puzzleConfigs, [selectedPuzzleId]: updatedConfig });
        e.preventDefault();
    }, [selectedPoint, puzzleConfigs, selectedPuzzleId]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setSaveError(null);
            const response = await fetch('/api/puzzle-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    puzzleId: selectedPuzzleId,
                    config: puzzleConfigs[selectedPuzzleId],
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save configuration');
            }

            // Reload the config to ensure we have the latest version
            const [puzzle1Module, puzzle2Module] = await Promise.all([
                import('@/config/puzzle1Config?t=' + Date.now()),
                import('@/config/puzzle2Config?t=' + Date.now()),
            ]);
            setPuzzleConfigs({
                1: puzzle1Module.puzzle1Config,
                2: puzzle2Module.puzzle2Config
            });
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : 'Failed to save');
        } finally {
            setIsSaving(false);
        }
    };

    const generateConfigFileContent = (config: PuzzleConfig) => {
        return `import { PuzzleConfig } from "../types";

export const puzzle${config.id}Config: PuzzleConfig = {
  id: ${config.id},
  name: "${config.name}",
  layout: {
    rows: ${config.layout.rows},
    cols: ${config.layout.cols},
    totalPieces: ${config.layout.totalPieces},
  },
  dimensions: [
${config.dimensions.map(piece => `    {
      id: ${piece.id},
      width: ${piece.width},
      height: ${piece.height},
      actualBounds: { left: ${piece.actualBounds.left}, top: ${piece.actualBounds.top}, width: ${piece.actualBounds.width}, height: ${piece.actualBounds.height} },
      connections: [
${piece.connections.map(conn => `        {
          id: "${conn.id}",
          x: ${conn.x},
          y: ${conn.y},
          type: "${conn.type}",
          connectsTo: {
            pieceId: ${conn.connectsTo.pieceId},
            pointId: "${conn.connectsTo.pointId}",
            sequence: ${conn.connectsTo.sequence},
          },
        }`).join(',\n')}
      ],
    }`).join(',\n')}
  ],
};`;
    };

    const handleCopyConfig = useCallback(() => {
        const config = generateConfigFileContent(puzzleConfigs[selectedPuzzleId]);
        navigator.clipboard.writeText(config).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    }, [puzzleConfigs, selectedPuzzleId]);

    if (isLoading || !puzzleConfigs[selectedPuzzleId]) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-600">Loading puzzle configurations...</div>
            </div>
        );
    }

    const selectedPuzzle = puzzleConfigs[selectedPuzzleId];
    const pieces = [...selectedPuzzle.dimensions].sort((a, b) => a.id - b.id);

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex gap-4">
            {/* Left side - Puzzle pieces */}
            <div ref={containerRef} className="w-1/2 bg-white rounded-xl shadow-lg p-4 overflow-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-black">Puzzle Config Tool: {selectedPuzzle.name}</h1>
                    <div className="flex gap-4">
                        <select
                            value={selectedPuzzleId}
                            onChange={(e) => setSelectedPuzzleId(parseInt(e.target.value))}
                            className="px-4 py-2 bg-white rounded-lg border border-gray-300 text-black"
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
                        <button
                            onClick={() => setAddingPointType('indent')}
                            className={`px-4 py-2 rounded-lg transition-colors ${addingPointType === 'indent' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 text-black'}`}
                        >
                            Add Indent
                        </button>
                        <button
                            onClick={() => setAddingPointType('outdent')}
                            className={`px-4 py-2 rounded-lg transition-colors ${addingPointType === 'outdent' ? 'bg-red-500 text-white' : 'bg-white border border-gray-300 text-black'}`}
                        >
                            Add Outdent
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {pieces.map((piece) => (
                        <div
                            key={piece.id}
                            className="relative bg-gray-100 rounded-lg p-2 cursor-pointer"
                            onClick={(e) => handlePieceClick(e, piece)}
                            style={{
                                width: piece.width * scaleFactor,
                                height: piece.height * scaleFactor,
                            }}
                        >
                            {renderPieceId(piece.id, showIds)}
                            <img
                                src={`/assets/puzzles/puzzle_${selectedPuzzleId}/${piece.id}.png`}
                                alt={`Piece ${piece.id}`}
                                className="w-full h-full object-contain"
                            />
                            {piece.connections.map((point) =>
                                renderDot(
                                    point,
                                    piece,
                                    showIds,
                                    selectedPoint?.pieceId === piece.id && selectedPoint?.pointId === point.id,
                                    handlePointClick,
                                    scaleFactor
                                )
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side - Config file */}
            <div className="w-1/2 bg-white rounded-xl shadow-lg p-4 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-black">puzzle{selectedPuzzleId}Config.ts</h2>
                        <button
                            onClick={handleCopyConfig}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${copySuccess
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-black'
                                }`}
                        >
                            {copySuccess ? 'Copied!' : 'Copy Config'}
                        </button>
                    </div>
                    <div className="text-sm text-gray-500">
                        {selectedPoint
                            ? `Editing: Piece ${selectedPoint.pieceId}, Point ${selectedPoint.pointId}`
                            : addingPointType
                                ? `Adding new ${addingPointType} point`
                                : 'Viewing'}
                    </div>
                </div>
                <pre className="text-sm font-mono bg-gray-100 p-4 rounded whitespace-pre overflow-auto text-black">
                    <code>{generateConfigFileContent(selectedPuzzle)}</code>
                </pre>
            </div>
        </div>
    );
} 