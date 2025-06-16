import { useEffect, useState } from 'react';

interface DeviceRestrictionProps {
    children: React.ReactNode;
}

export default function DeviceRestriction({ children }: DeviceRestrictionProps) {
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAccess = () => {
            // Check if we're in development
            const isDev = process.env.NODE_ENV === 'development';

            // Check if screen is desktop size (min-width: 1024px)
            const isDesktop = window.innerWidth >= 1024;

            setIsAllowed(isDev && isDesktop);
            setIsLoading(false);
        };

        checkAccess();
        window.addEventListener('resize', checkAccess);

        return () => window.removeEventListener('resize', checkAccess);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-600">Checking access...</div>
            </div>
        );
    }

    if (!isAllowed) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Access Restricted</h1>
                    <p className="text-gray-700 mb-2">This tool is only accessible:</p>
                    <ul className="list-disc list-inside text-gray-600 mb-4">
                        <li>In development environment</li>
                        <li>On desktop devices (min-width: 1024px)</li>
                    </ul>
                    <p className="text-sm text-gray-500">
                        Current environment: {process.env.NODE_ENV}<br />
                        Current width: {window.innerWidth}px
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
} 