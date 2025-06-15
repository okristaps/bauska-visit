import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface PuzzlePiece {
    id: number;
    correctPosition: number;
}

const PuzzlePiece = ({ id, position, isCorrect }: { id: number; position: number; isCorrect: boolean }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'puzzle-piece',
        item: { id, fromPosition: position },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={dragRef as any}
            className={`w-[100px] h-[100px] cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'
                } ${isCorrect ? 'border-green-500' : 'border-gray-300'} border-2 rounded`}
            style={{
                backgroundImage: `url(/assets/puzzles/puzzle_1/${id}.png)`,
                backgroundSize: 'cover',
            }}
        />
    );
};

const DropZone = ({ position, onDrop, children }: { position: number; onDrop: (fromPos: number, toPos: number) => void; children: React.ReactNode }) => {
    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: 'puzzle-piece',
        drop: (item: { id: number; fromPosition: number }) => {
            onDrop(item.fromPosition, position);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={dropRef as any}
            className={`w-[100px] h-[100px] border ${isOver ? 'border-blue-500 bg-blue-100' : 'border-dashed border-gray-300'
                }`}
        >
            {children}
        </div>
    );
};

export default function JigsawPuzzle() {
    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
    const [positions, setPositions] = useState<number[]>([]);

    useEffect(() => {
        // Initialize puzzle pieces in random positions
        const initialPieces = Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            correctPosition: i,
        }));

        const shuffledPositions = Array.from({ length: 8 }, (_, i) => i)
            .sort(() => Math.random() - 0.5);

        setPieces(initialPieces);
        setPositions(shuffledPositions);
    }, []);

    const handleDrop = (fromPos: number, toPos: number) => {
        const newPositions = [...positions];
        const temp = newPositions[fromPos];
        newPositions[fromPos] = newPositions[toPos];
        newPositions[toPos] = temp;
        setPositions(newPositions);
    };

    const isPieceInCorrectPosition = (pieceId: number, position: number) => {
        // For the 8765/1234 layout:
        const correctPositions = [7, 6, 5, 4, 0, 1, 2, 3];
        return correctPositions[position] === pieceId - 1;
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col items-center gap-8 p-8">
                <h2 className="text-2xl font-bold">Jigsaw Puzzle</h2>
                <div className="grid grid-cols-4 gap-2">
                    {positions.map((pieceIndex, position) => (
                        <DropZone key={position} position={position} onDrop={handleDrop}>
                            {pieces[pieceIndex] && (
                                <PuzzlePiece
                                    id={pieces[pieceIndex].id}
                                    position={position}
                                    isCorrect={isPieceInCorrectPosition(pieces[pieceIndex].id, position)}
                                />
                            )}
                        </DropZone>
                    ))}
                </div>
            </div>
        </DndProvider>
    );
} 