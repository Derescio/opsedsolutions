// components/ThemePopup.tsx
'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ThemePopup() {
    const { theme, setTheme } = useTheme();
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem('seenThemePopup');
        if (!hasSeen) {
            setShowPopup(true);
        }
    }, []);

    const handleClose = () => {
        setShowPopup(false);
        localStorage.setItem('seenThemePopup', 'true');
    };

    if (!showPopup) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl backdrop-blur-lg bg-white/30 dark:bg-black/30 border border-white/20 shadow-xl p-4 text-sm">
            <div className="mb-2 font-medium">You can change the theme of the website to suit your viewing needs. You can also do so from the navigation bar.  </div>
            <div className="flex justify-between items-center gap-2">
                <button
                    onClick={() => setTheme('light')}
                    className="px-3 py-1 rounded-lg bg-white text-black hover:bg-gray-100 transition"
                >
                    Light
                </button>
                <button
                    onClick={() => setTheme('dark')}
                    className="px-3 py-1 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                >
                    Dark
                </button>
                <button
                    onClick={handleClose}
                    className="ml-auto text-xs underline text-gray-600 dark:text-gray-300"
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
}
