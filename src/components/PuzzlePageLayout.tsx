'use client';

import { useState, useEffect } from 'react';
import PuzzleGame from '@/components/PuzzleGame';

interface PuzzlePageLayoutProps {
    puzzleId: number;
    title: string;
    onComplete?: () => void;
}

export default function PuzzlePageLayout({ puzzleId, title, onComplete }: PuzzlePageLayoutProps) {
    const [time, setTime] = useState(0);
    const [timerStarted, setTimerStarted] = useState(false);

    useEffect(() => {
        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVh();

        window.addEventListener('resize', setVh);
        return () => window.removeEventListener('resize', setVh);
    }, []);

    const handleTimeUpdate = (newTime: number) => {
        if (!timerStarted) {
            setTimerStarted(true);
        }
        setTime(newTime);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleComplete = () => {
        console.log(`Puzzle ${puzzleId} completed!`);
        if (onComplete) {
            onComplete();
        }
    };

    return (
        <div
            className="flex flex-col overflow-hidden relative"
            style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
        >
            <div className="flex-none h-[10vh] flex justify-center items-center">
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>
            {timerStarted && (
                <p className="absolute top-8 right-8 text-xl font-mono bg-black bg-opacity-50 px-4 py-2 rounded-lg text-white">
                    Time: {formatTime(time)}
                </p>
            )}
            <div className="flex-1 relative">
                <PuzzleGame
                    className="absolute inset-0"
                    puzzleId={puzzleId}
                    onTimeUpdate={handleTimeUpdate}
                    onComplete={handleComplete}
                />
            </div>
            <div className="flex-none h-[10vh] flex justify-center items-center">
                <p className="text-gray-600">Arrange the pieces to complete the puzzle</p>
            </div>
        </div>
    );
} 