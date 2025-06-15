'use client';

import PuzzleGame from '@/components/PuzzleGame';

export default function Puzzle2Page() {
    return (
        <div className="flex flex-col h-[100vh] overflow-hidden">
            <div className="flex-none h-[10vh] flex justify-center items-center">
                <h1 className="text-2xl font-bold">Bauska Castle Garden</h1>
            </div>
            <div className="flex-1 relative">
                <PuzzleGame
                    className="absolute inset-0"
                    puzzleId={2}
                    onComplete={() => {
                        console.log('Puzzle completed!');
                        // You can add any completion logic here
                    }}
                />
            </div>
            <div className="flex-none h-[10vh] flex justify-center items-center">
                <p className="text-gray-600">Arrange the pieces to complete the puzzle</p>
            </div>
        </div>
    );
} 