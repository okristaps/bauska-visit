'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PuzzleConfig, ConnectionPoint, PieceDimensions } from '@/types';

const ARROW_KEY_MOVE_AMOUNT = 1;

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
            }}
            onClick={() => onPointClick(piece.id, point.id)}
            title={`${point.id} (${point.x}, ${point.y}) -> piece_${point.connectsTo?.pieceId || 'unconnected'}${point.connectsTo.pointId ? ` (${point.connectsTo.pointId})` : ''}`}
        />
    );
}

export default function PuzzleConfigTool() {
    const [showIds, setShowIds] = useState(true);
    const [puzzleConfigs, setPuzzleConfigs] = useState<Record<number, PuzzleConfig>>({});
    const [selectedPuzzleId, setSelectedPuzzleId] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
    const [linkingPoint, setLinkingPoint] = useState<SelectedPoint | null>(null);
    const [addingPointType, setAddingPointType] = useState<'indent' | 'outdent' | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [scaleFactor, setScaleFactor] = useState(0.2);
    const [copySuccess, setCopySuccess] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

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

    const onDotClick = useCallback((pieceId: number, pointId: string) => {
        if (linkingPoint) {
            // Cancel linking if the source point is clicked again
            if (linkingPoint.pieceId === pieceId && linkingPoint.pointId === pointId) {
                setLinkingPoint(null);
                setSelectedPoint({ pieceId, pointId });
                return;
            }

            // Create a deep copy of the config to ensure immutable updates
            const updatedConfig = JSON.parse(JSON.stringify(puzzleConfigs[selectedPuzzleId])) as PuzzleConfig;

            // Find pieces and points from the deep copy
            const sourcePiece = updatedConfig.dimensions.find(p => p.id === linkingPoint.pieceId);
            const sourcePoint = sourcePiece?.connections.find(p => p.id === linkingPoint.pointId);
            const targetPiece = updatedConfig.dimensions.find(p => p.id === pieceId);
            const targetPoint = targetPiece?.connections.find(p => p.id === pointId);

            if (!sourcePiece || !sourcePoint || !targetPiece || !targetPoint) return;

            // Apply the two-way link
            sourcePoint.connectsTo = { pieceId: targetPiece.id, pointId: targetPoint.id, sequence: 1 };
            targetPoint.connectsTo = { pieceId: sourcePiece.id, pointId: sourcePoint.id, sequence: 1 };

            // Set the new state with the updated config
            setPuzzleConfigs(prevConfigs => ({
                ...prevConfigs,
                [selectedPuzzleId]: updatedConfig
            }));
            setLinkingPoint(null);
        } else {
            setSelectedPoint({ pieceId, pointId });
            setAddingPointType(null);
        }
    }, [linkingPoint, puzzleConfigs, selectedPuzzleId]);

    const handleStartLink = useCallback(() => {
        if (!selectedPoint) return;
        setLinkingPoint(selectedPoint);
        setSelectedPoint(null);
    }, [selectedPoint]);

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

        const moveAmount = e.repeat ? 5 : 1;

        switch (e.key) {
            case 'ArrowLeft':
                point.x -= moveAmount;
                break;
            case 'ArrowRight':
                point.x += moveAmount;
                break;
            case 'ArrowUp':
                point.y -= moveAmount;
                break;
            case 'ArrowDown':
                point.y += moveAmount;
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

            // No need to reload, the state is the source of truth.
            // This also fixes a race condition where the file might not be updated on disk
            // before the import runs, causing dots to disappear.
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

    // Calculate piece positions for the preview
    const calculatePiecePositions = useCallback((pieces: PieceDimensions[]) => {
        const positions = new Map<number, { x: number, y: number }>();

        // Start with piece 1 at (0,0)
        positions.set(1, { x: 0, y: 0 });

        // Helper to check if a piece is positioned
        const isPositioned = (id: number) => positions.has(id);

        // Helper to position a piece relative to another piece based on connection points
        const positionPieceRelativeTo = (
            piece: PieceDimensions,
            connection: ConnectionPoint,
            anchorPiece: PieceDimensions,
            anchorPos: { x: number, y: number }
        ) => {
            const anchorPoint = anchorPiece.connections.find((p: ConnectionPoint) => p.id === connection.connectsTo.pointId);
            if (!anchorPoint) return null;

            // Calculate center points
            const pieceCenter = { x: piece.width / 2, y: piece.height / 2 };
            const anchorCenter = { x: anchorPiece.width / 2, y: anchorPiece.height / 2 };

            // Calculate the position that would align the connection points
            const x = anchorPos.x + (anchorCenter.x + anchorPoint.x) - (pieceCenter.x + connection.x);
            const y = anchorPos.y + (anchorCenter.y + anchorPoint.y) - (pieceCenter.y + connection.y);

            return { x, y };
        };

        // Keep trying to position pieces until we can't position any more
        let madeProgress = true;
        while (madeProgress) {
            madeProgress = false;

            for (const piece of pieces) {
                if (isPositioned(piece.id)) continue;

                // Try to position this piece based on its connections
                for (const connection of piece.connections) {
                    const connectedPieceId = connection.connectsTo.pieceId;
                    const anchorPos = positions.get(connectedPieceId);
                    const anchorPiece = pieces.find(p => p.id === connectedPieceId);

                    if (anchorPos && anchorPiece) {
                        const newPos = positionPieceRelativeTo(piece, connection, anchorPiece, anchorPos);
                        if (newPos) {
                            positions.set(piece.id, newPos);
                            madeProgress = true;
                            break;
                        }
                    }
                }
            }
        }

        return positions;
    }, []);

    const positionPieceRelativeTo = useCallback((
        piece: PieceDimensions,
        connection: ConnectionPoint,
        anchorPiece: PieceDimensions,
        anchorPos: { x: number, y: number }
    ) => {
        const anchorPoint = anchorPiece.connections.find((p: ConnectionPoint) => p.id === connection.connectsTo.pointId);
        if (!anchorPoint) return null;

        const pieceCenter = { x: piece.width / 2, y: piece.height / 2 };
        const anchorCenter = { x: anchorPiece.width / 2, y: anchorPiece.height / 2 };

        const x = anchorPos.x + (anchorCenter.x + anchorPoint.x) - (pieceCenter.x + connection.x);
        const y = anchorPos.y + (anchorCenter.y + anchorPoint.y) - (pieceCenter.y + connection.y);

        return { x, y };
    }, []);

    const selectedPuzzle = puzzleConfigs[selectedPuzzleId];

    const connectionPairs = useMemo(() => {
        const uniqueConnections = new Set<string>();
        if (selectedPuzzle) {
            selectedPuzzle.dimensions.forEach(piece => {
                piece.connections.forEach(conn => {
                    if (conn.connectsTo && conn.connectsTo.pieceId !== 0) {
                        const targetPiece = selectedPuzzle.dimensions.find(p => p.id === conn.connectsTo.pieceId);
                        const returnConn = targetPiece?.connections.find(c => c.connectsTo.pieceId === piece.id && c.connectsTo.pointId === conn.id);
                        if (returnConn) {
                            const pair = [piece.id, conn.connectsTo.pieceId].sort((a, b) => a - b);
                            uniqueConnections.add(JSON.stringify(pair));
                        }
                    }
                });
            });
        }
        return Array.from(uniqueConnections).map(p => JSON.parse(p) as [number, number]);
    }, [selectedPuzzle]);

    if (isLoading || !selectedPuzzle) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-600">Loading puzzle configurations...</div>
            </div>
        );
    }

    const pieces = [...selectedPuzzle.dimensions].sort((a, b) => a.id - b.id);

    return (
        <div className="h-screen bg-gray-100 p-4 flex flex-col gap-4">
            {/* Top section - Configurator and Config */}
            <div className="flex gap-4 h-[60vh]">
                {/* Left side - Puzzle pieces */}
                <div ref={containerRef} className="w-2/3 bg-white rounded-xl shadow-lg p-4 overflow-auto">
                    <div className="sticky top-[-1rem] bg-white pt-4 pb-4 -mt-4 mx-[-1rem] px-4 z-10 flex justify-end items-center mb-4 border-b">
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
                                onClick={handleStartLink}
                                disabled={!selectedPoint || !!linkingPoint}
                                className="px-4 py-2 rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Link Point
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

                    <div className="grid gap-8" style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${selectedPuzzle.layout.cols}, min-content)`,
                        justifyContent: 'space-between',
                        alignItems: 'start'
                    }}>
                        {pieces.map((piece) => (
                            <div
                                key={piece.id}
                                className="relative bg-gray-100 rounded-lg p-2 cursor-pointer"
                                onClick={(e) => handlePieceClick(e, piece)}
                                style={{
                                    width: piece.width * scaleFactor,
                                    height: piece.height * scaleFactor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {renderPieceId(piece.id, showIds)}
                                <img
                                    src={`/assets/puzzles/puzzle_${selectedPuzzleId}/${piece.id}.png`}
                                    alt={`Piece ${piece.id}`}
                                    className="w-full h-full object-contain"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%'
                                    }}
                                />
                                {piece.connections.map((point) =>
                                    renderDot(
                                        point,
                                        piece,
                                        showIds,
                                        selectedPoint?.pieceId === piece.id && selectedPoint?.pointId === point.id,
                                        linkingPoint?.pieceId === piece.id && linkingPoint?.pointId === point.id,
                                        onDotClick,
                                        scaleFactor
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side - Config file */}
                <div className="w-1/3 bg-white rounded-xl shadow-lg p-4 flex flex-col">
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
                            {linkingPoint
                                ? `LINKING: From piece ${linkingPoint.pieceId} (${linkingPoint.pointId}). Click target.`
                                : selectedPoint
                                    ? `Editing: Piece ${selectedPoint.pieceId}, Point ${selectedPoint.pointId}`
                                    : addingPointType
                                        ? `Adding new ${addingPointType} point`
                                        : 'Viewing'}
                        </div>
                    </div>
                    <pre className="text-sm font-mono bg-gray-100 p-4 rounded whitespace-pre overflow-auto text-black flex-1">
                        <code>{generateConfigFileContent(selectedPuzzle)}</code>
                    </pre>
                </div>
            </div>

            {/* Bottom section - Preview */}
            <div className="bg-white rounded-xl shadow-lg p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-black">Connection Previews</h2>
                    <div className="text-sm text-gray-500">
                        Showing {connectionPairs.length} unique two-way connections
                    </div>
                </div>
                <div
                    ref={previewRef}
                    className="relative w-full flex-1 overflow-y-auto"
                >
                    <div className="flex flex-wrap gap-4 p-4">
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
        </div>
    );
} 