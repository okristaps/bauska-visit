export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t">
            <div className="container mx-auto px-4 py-6 grid grid-cols-[1fr_auto_1fr]">
                {/* Empty left column to balance the layout */}
                <div></div>

                {/* Centered text box */}
                <div className="max-w-2xl">
                    <div className="bg-gray-100 rounded-lg p-4">
                        <p className="text-gray-700 text-center">
                            Welcome to Bauska! Explore our historic castle and beautiful gardens through this interactive puzzle game. Complete each puzzle to discover more about our cultural heritage.
                        </p>
                    </div>
                </div>

                {/* Right column with button */}
                <div className="flex justify-end items-center">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Start Exploring
                    </button>
                </div>
            </div>
        </footer>
    );
} 