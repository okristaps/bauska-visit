"use client";
import { useEffect, useState } from "react";

function isMobileOrTablet() {
    return /android|iphone|ipad|ipod|windows phone/i.test(navigator.userAgent);
}

export default function FullscreenPrompt() {
    const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
    const [showRotatePrompt, setShowRotatePrompt] = useState(false);
    const [rotatePromptDismissed, setRotatePromptDismissed] = useState(false);

    useEffect(() => {
        if (!isMobileOrTablet()) return;

        const checkState = () => {
            const isLandscape = window.innerWidth > window.innerHeight;
            const isFullscreen = document.fullscreenElement || (document as any).webkitFullscreenElement;
            setShowRotatePrompt(!isLandscape);
            setShowFullscreenPrompt(isLandscape && !isFullscreen && /android/i.test(navigator.userAgent));
            if (isLandscape && rotatePromptDismissed) {
                setRotatePromptDismissed(false); // Reset if user rotates back to landscape
            }
        };

        checkState();
        window.addEventListener("resize", checkState);
        document.addEventListener("fullscreenchange", checkState);
        document.addEventListener("webkitfullscreenchange", checkState);
        return () => {
            window.removeEventListener("resize", checkState);
            document.removeEventListener("fullscreenchange", checkState);
            document.removeEventListener("webkitfullscreenchange", checkState);
        };
    }, []);

    const enterFullscreen = () => {
        const el = document.documentElement;
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if ((el as any).webkitRequestFullscreen) {
            (el as any).webkitRequestFullscreen();
        }
        // Try to lock orientation to landscape
        const orientation = screen.orientation || (screen as any).mozOrientation || (screen as any).msOrientation;
        if (orientation && (orientation as any).lock) {
            (orientation as any).lock('landscape').catch(() => { });
        }
        setShowFullscreenPrompt(false);
    };

    if (showRotatePrompt && !rotatePromptDismissed) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
                    <div className="mb-4 flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" width="48" height="48"><rect width="48" height="48" rx="12" fill="#e0e7ff" /><path d="M12 24a12 12 0 0 1 12-12h4" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="M36 24a12 12 0 0 1-12 12h-4" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="M32 16l4-4-4-4" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <h2 className="text-lg font-bold mb-2 text-gray-800">Rotate Your Device</h2>
                    <p className="mb-2 text-gray-600">Please rotate your device to landscape mode for the best experience.</p>
                </div>
            </div>
        );
    }

    if (showFullscreenPrompt) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Fullscreen Recommended</h2>
                    <p className="mb-4 text-gray-600">For the best experience, tap below to enter fullscreen and hide the browser bar.</p>
                    <button
                        onClick={enterFullscreen}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Fullscreen
                    </button>
                </div>
            </div>
        );
    }

    return null;
} 