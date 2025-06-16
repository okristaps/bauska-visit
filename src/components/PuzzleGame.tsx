'use client';

import { usePuzzle } from '@/hooks/usePuzzle';
import { PieceState } from '@/types/index';

interface PuzzleGameProps {
    onComplete?: () => void;
    className?: string;
    puzzleId: number;
    onTimeUpdate?: (time: number) => void;
}

export default function PuzzleGame({ onComplete, className = '', puzzleId, onTimeUpdate }: PuzzleGameProps) {
    const {
        puzzleConfig,
        pieces,
        isCompleted,
        getContainerProps,
        getPieceProps,
    } = usePuzzle({ puzzleId, onComplete, onTimeUpdate });

    return (
        <div
            {...getContainerProps()}
            className={`h-full relative overflow-hidden ${className}`}
        >
            {pieces.map((piece: PieceState) => {
                const { key, ...pieceProps } = getPieceProps(piece);
                return (
                    <div
                        key={key}
                        {...pieceProps}
                        className={`absolute select-none ${isCompleted ? 'cursor-default' : 'cursor-move'}`}
                    >
                        <img
                            src={`/assets/puzzles/puzzle_${puzzleId}/${piece.id}.png`}
                            alt={`Puzzle piece ${piece.id}`}
                            className="w-full h-full pointer-events-none"
                            draggable={false}
                        />
                    </div>
                );
            })}
        </div>
    );
}