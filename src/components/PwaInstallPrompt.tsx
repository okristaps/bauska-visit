"use client";
import { useEffect, useState } from "react";

function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isAndroid() {
    return /android/i.test(navigator.userAgent);
}
function isStandalone() {
    // iOS: window.navigator.standalone, Android: display-mode
    return (
        (typeof window !== "undefined" &&
            (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)) ||
        (typeof window !== "undefined" && (window.navigator as any).standalone === true)
    );
}

export default function PwaInstallPrompt({ children }: { children: React.ReactNode }) {
    const [showPrompt, setShowPrompt] = useState(false);
    useEffect(() => {
        if (isIos() && !isStandalone()) {
            setShowPrompt(true);
        } else {
            setShowPrompt(false);
        }
    }, []);

    if (showPrompt) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Install App for Best Experience</h2>
                    {isIos() ? (
                        <>
                            <p className="mb-4 text-gray-600">To play, please add this app to your home screen:</p>
                            <ol className="text-left text-gray-700 mb-4 list-decimal list-inside">
                                <li>Tap the <span className="inline-block">Share</span> <span role="img" aria-label="Share">&#x1f5d2;</span> icon in Safari.</li>
                                <li>Scroll down and tap <b>"Add to Home Screen"</b>.</li>
                                <li>Open the app from your home screen.</li>
                            </ol>
                        </>
                    ) : null}
                    <p className="text-xs text-gray-400 mt-2">This game is only playable as a home screen app.</p>
                </div>
            </div>
        );
    }
    return <>{children}</>;
} 