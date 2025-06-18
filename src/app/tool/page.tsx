'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PuzzleConfig, ConnectionPoint, PieceDimensions } from '@/types';
import { Toolbar } from './components/Toolbar';
import { PuzzleGrid } from './components/PuzzleGrid';
import { ConnectionPreview } from './components/ConnectionPreview';
import { AllConnectionsPreview } from './components/AllConnectionsPreview';


const ARROW_KEY_MOVE_AMOUNT = 1;

interface SelectedPoint {
    pieceId: number;
    pointId: string;
}

export default function PuzzleConfigToolPage() {
    return (
        <PuzzleConfigTool />
    );
}

function PuzzleConfigTool() {
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

    // Load puzzle configurations dynamically
    useEffect(() => {
        async function loadPuzzleConfigs() {
            try {
                setIsLoading(true);
                const [puzzle1Module, puzzle2Module, puzzle3Module] = await Promise.all([
                    import('@/config/puzzle1Config'),
                    import('@/config/puzzle2Config'),
                    import('@/config/puzzle3Config'),
                ]);
                setPuzzleConfigs({
                    1: puzzle1Module.puzzle1Config,
                    2: puzzle2Module.puzzle2Config,
                    3: puzzle3Module.puzzle3Config,
                });
            } catch (error) {
                console.error('Error loading puzzle configurations:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadPuzzleConfigs();
    }, []);

    const calculatePuzzleDimensions = useCallback((config: PuzzleConfig) => {
        let maxRowWidth = 0;
        let totalHeight = 0;
        for (let row = 0; row < config.layout.rows; row++) {
            let rowWidth = 0;
            let rowHeight = 0;
            for (let col = 0; col < config.layout.cols; col++) {
                const pieceIndex = row * config.layout.cols + col;
                const piece = config.dimensions[pieceIndex];
                if (piece) {
                    rowWidth += piece.width + 20;
                    rowHeight = Math.max(rowHeight, piece.height);
                }
            }
            maxRowWidth = Math.max(maxRowWidth, rowWidth);
            totalHeight += rowHeight + 20;
        }
        return {
            width: maxRowWidth - 20,
            height: totalHeight - 20
        };
    }, []);

    const updateScaleFactor = useCallback(() => {
        if (!containerRef.current || !puzzleConfigs[selectedPuzzleId]) return;
        const container = containerRef.current;
        const { width: puzzleWidth, height: puzzleHeight } = calculatePuzzleDimensions(puzzleConfigs[selectedPuzzleId]);
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const widthScale = (containerWidth * 0.9) / puzzleWidth;
        const heightScale = (containerHeight * 0.9) / puzzleHeight;
        const newScaleFactor = Math.min(widthScale, heightScale, 0.2);
        setScaleFactor(newScaleFactor);
    }, [calculatePuzzleDimensions, puzzleConfigs, selectedPuzzleId]);

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            updateScaleFactor();
        });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, [updateScaleFactor]);

    const onDotClick = useCallback((pieceId: number, pointId: string) => {
        if (linkingPoint) {
            if (linkingPoint.pieceId === pieceId && linkingPoint.pointId === pointId) {
                setLinkingPoint(null);
                setSelectedPoint({ pieceId, pointId });
                return;
            }
            const updatedConfig = JSON.parse(JSON.stringify(puzzleConfigs[selectedPuzzleId])) as PuzzleConfig;
            const sourcePiece = updatedConfig.dimensions.find(p => p.id === linkingPoint.pieceId);
            const sourcePoint = sourcePiece?.connections.find(p => p.id === linkingPoint.pointId);
            const targetPiece = updatedConfig.dimensions.find(p => p.id === pieceId);
            const targetPoint = targetPiece?.connections.find(p => p.id === pointId);
            if (!sourcePiece || !sourcePoint || !targetPiece || !targetPoint) return;
            sourcePoint.connectsTo = { pieceId: targetPiece.id, pointId: targetPoint.id, sequence: 1 };
            targetPoint.connectsTo = { pieceId: sourcePiece.id, pointId: sourcePoint.id, sequence: 1 };
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

    const handlePieceClick = useCallback((e: React.MouseEvent, piece: PieceDimensions) => {
        if (!addingPointType) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
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
            case 'ArrowLeft': point.x -= moveAmount; break;
            case 'ArrowRight': point.x += moveAmount; break;
            case 'ArrowUp': point.y -= moveAmount; break;
            case 'ArrowDown': point.y += moveAmount; break;
            case 'Delete':
            case 'Backspace':
                const pieceIndex = updatedConfig.dimensions.findIndex(p => p.id === selectedPoint.pieceId);
                updatedConfig.dimensions[pieceIndex].connections = piece.connections.filter(p => p.id !== selectedPoint.pointId);
                setSelectedPoint(null);
                break;
            default: return;
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    puzzleId: selectedPuzzleId,
                    config: puzzleConfigs[selectedPuzzleId],
                }),
            });
            if (!response.ok) throw new Error('Failed to save configuration');
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : 'Failed to save');
        } finally {
            setIsSaving(false);
        }
    };

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
        <div className="h-screen bg-gray-100 flex flex-col">
            <Toolbar
                selectedPuzzleId={selectedPuzzleId}
                onPuzzleChange={setSelectedPuzzleId}
                showIds={showIds}
                onToggleShowIds={() => setShowIds(!showIds)}
                onStartLink={handleStartLink}
                selectedPoint={selectedPoint}
                linkingPoint={linkingPoint}
                onSetAddingPointType={setAddingPointType}
                addingPointType={addingPointType}
                onSave={handleSave}
                isSaving={isSaving}
                puzzleConfigs={puzzleConfigs}
            />
            <main className="flex-1 overflow-hidden p-4 min-h-[400px]">
                <div className="h-full grid grid-cols-3 gap-4">
                    <div ref={containerRef} className="col-span-2 bg-white rounded-xl shadow-lg p-4 overflow-auto">
                        <PuzzleGrid
                            pieces={pieces}
                            layout={selectedPuzzle.layout}
                            scaleFactor={scaleFactor}
                            showIds={showIds}
                            selectedPuzzleId={selectedPuzzleId}
                            selectedPoint={selectedPoint}
                            linkingPoint={linkingPoint}
                            onPieceClick={handlePieceClick}
                            onDotClick={onDotClick}
                        />
                    </div>
                    <div className="col-span-1 overflow-y-auto">
                        <ConnectionPreview
                            selectedPoint={selectedPoint}
                            linkingPoint={linkingPoint}
                            addingPointType={addingPointType}
                            selectedPuzzle={selectedPuzzle}
                            selectedPuzzleId={selectedPuzzleId}
                            positionPieceRelativeTo={positionPieceRelativeTo}
                        />
                    </div>
                </div>
            </main>
            <footer className="p-4">
                <AllConnectionsPreview
                    pieces={pieces}
                    connectionPairs={connectionPairs}
                    selectedPuzzleId={selectedPuzzleId}
                    positionPieceRelativeTo={positionPieceRelativeTo}
                />
            </footer>
        </div>
    );
} 