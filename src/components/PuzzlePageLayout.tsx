'use client';

import { useState, useEffect } from 'react';
import PuzzleGame from '@/components/PuzzleGame';
import Header from '@/components/Header';
import FullscreenPrompt from './FullscreenPrompt';
import { useRouter } from 'next/navigation';
import { allPuzzleConfigs } from '../config/puzzle1Config';

interface PuzzlePageLayoutProps {
    puzzleId: number;
    title: string;
    onComplete?: () => void;
    infoBoxText?: string;
}

export default function PuzzlePageLayout({ puzzleId, title, onComplete, infoBoxText }: PuzzlePageLayoutProps) {
    const [time, setTime] = useState(0);
    const [timerStarted, setTimerStarted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
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
        setTimeout(() => setShowModal(true), 500);
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

            <div className="flex-none h-[6vh] sm:h-[7vh] lg:h-[10vh] grid grid-cols-[1fr_auto_1fr] items-center px-1 sm:px-2 lg:px-4 w-full">
                <div></div>
                <div className="flex flex-col items-center">
                    <p className="text-[10px] sm:text-xs lg:text-base">{puzzleId}. no 4 spelem</p>
                    <h1 className="text-sm sm:text-base lg:text-2xl font-bold">{title}</h1>
                    <p className="text-[10px] sm:text-xs lg:text-base"> Spele saksies tikko ka tu pieskarsies kadam gabalinam</p>
                </div>
                <div className="flex justify-end px-2 sm:px-3 lg:px-6">
                    {timerStarted && (
                        <div className="flex flex-col items-end min-w-[70px]">
                            <div className="text-xs sm:text-sm lg:text-base font-medium text-[#0A2342]">Tavs spēles laiks</div>
                            <div className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-[#0A2342] font-mono leading-none">{formatTime(time)}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 relative">
                <PuzzleGame
                    className="absolute inset-0"
                    puzzleId={puzzleId}
                    onTimeUpdate={handleTimeUpdate}
                    onComplete={handleComplete}
                />
            </div>

            <div className="container mx-auto px-1 sm:px-2 lg:px-4 py-0.5 sm:py-1 lg:py-2 grid grid-cols-[1fr_auto_1fr]">
                <div></div>
                <div className="max-w-lg">
                    <div className="bg-gray-100 rounded-lg p-1 sm:p-1.5 lg:p-2">
                        <p className="text-gray-700 text-center text-[9px] sm:text-xs lg:text-sm">
                            {infoBoxText}
                        </p>
                    </div>
                </div>
                <div className="flex justify-end items-center">
                    <button
                        className="ml-1 sm:ml-1.5 lg:ml-2 px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[9px] sm:text-xs lg:text-sm"
                        onClick={() => router.replace("/")}
                    >
                        {"Beigt spēli / uz sākumu"}
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 transition-colors duration-300">
                    <div className="bg-[#F7F7F2] border-4 border-[#BFA140] rounded-2xl px-6 py-8 w-[90vw] max-w-md flex flex-col items-center shadow-xl animate-modal-in">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2342] mb-2 text-center">Spēle pabeigta!</h2>
                        <div className="text-base sm:text-lg text-[#0A2342] font-medium mb-1 text-center">Spēles laiks</div>
                        <div className="text-4xl sm:text-5xl font-extrabold text-[#0A2342] font-mono mb-6 text-center">{formatTime(time)}</div>
                        <button
                            className="bg-[#183153] text-white rounded-lg px-8 py-3 text-base font-medium hover:bg-[#0A2342] transition-colors"
                            onClick={() => {
                                if (puzzleId < allPuzzleConfigs.length) {
                                    router.replace(`/puzzle-${puzzleId + 1}`);
                                } else {
                                    router.replace(`/`);
                                }
                                setShowModal(false);
                            }}
                        >
                            {puzzleId < allPuzzleConfigs.length ? 'Nākamā spēle' : 'Uz sākumu'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 