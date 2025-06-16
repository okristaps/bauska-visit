'use client';

import { useState, useEffect } from 'react';
import PuzzleGame from '@/components/PuzzleGame';
import Header from '@/components/Header';
import FullscreenPrompt from './FullscreenPrompt';

interface PuzzlePageLayoutProps {
    puzzleId: number;
    title: string;
    onComplete?: () => void;
}

export default function PuzzlePageLayout({ puzzleId, title, onComplete }: PuzzlePageLayoutProps) {
    const [time, setTime] = useState(0);
    const [timerStarted, setTimerStarted] = useState(false);

    useEffect(() => {
        document.body.classList.add('puzzle-page');

        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVh();

        window.addEventListener('resize', setVh);

        return () => {
            document.body.classList.remove('puzzle-page');
            window.removeEventListener('resize', setVh);
        };
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
            <FullscreenPrompt />
            <Header />

            {timerStarted && (
                <p className="absolute top-1 right-1 sm:top-2 sm:right-2 lg:top-8 lg:right-8 text-xs sm:text-sm lg:text-xl font-mono bg-black bg-opacity-50 px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-4 lg:py-2 rounded-lg text-white">
                    Time: {formatTime(time)}
                </p>
            )}

            <div className="flex-none h-[6vh] sm:h-[7vh] lg:h-[10vh] flex flex-col justify-center items-center text-center px-1 sm:px-2 lg:px-4">
                <p className="text-[10px] sm:text-xs lg:text-base">1. spele no 4 spelem</p>
                <h1 className="text-sm sm:text-base lg:text-2xl font-bold">{title}</h1>
                <p className="text-[10px] sm:text-xs lg:text-base"> Spele saksies tikko ka tu pieskarsies kadam gabalinam</p>
            </div>

            <div className="flex-1 relative">
                <PuzzleGame
                    className="absolute inset-0"
                    puzzleId={puzzleId}
                    onTimeUpdate={handleTimeUpdate}
                    onComplete={handleComplete}
                />
            </div>

            <div className="container mx-auto px-1 sm:px-2 lg:px-4 py-1 sm:py-2 lg:py-6 grid grid-cols-[1fr_auto_1fr]">
                <div></div>
                <div className="max-w-2xl">
                    <div className="bg-gray-100 rounded-lg p-1.5 sm:p-2 lg:p-4">
                        <p className="text-gray-700 text-center text-[10px] sm:text-xs lg:text-base">
                            Welcome to Bauska! Explore our historic castle and beautiful gardens through this interactive puzzle game. Complete each puzzle to discover more about our cultural heritage.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end items-center">
                    <button className="ml-1.5 sm:ml-2 lg:ml-4 px-2 py-1 sm:px-3 sm:py-1.5 lg:px-6 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[10px] sm:text-xs lg:text-base">
                        Start Exploring
                    </button>
                </div>
            </div>
        </div>
    );
} 