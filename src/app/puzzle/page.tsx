'use client';

import PuzzleGame from '@/components/PuzzleGame';

export default function PuzzlePage() {
    return (
        <div className="flex flex-col h-[100vh] overflow-hidden">
            <div className="flex-none h-[10vh] flex justify-center items-center">
                test
            </div>
            <div className="flex-1 relative">
                <PuzzleGame
                    className="absolute inset-0"
                    onComplete={() => {
                        console.log('Puzzle completed!');
                        // You can add any completion logic here
                    }}
                />
            </div>
            <div className="flex-none h-[10vh] flex justify-center items-center">
                test
            </div>
        </div>
    );
} 