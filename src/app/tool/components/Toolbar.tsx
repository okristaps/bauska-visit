import React from 'react';

interface ToolbarProps {
    selectedPuzzleId: number;
    onPuzzleChange: (id: number) => void;
    showIds: boolean;
    onToggleShowIds: () => void;
    onStartLink: () => void;
    selectedPoint: any;
    linkingPoint: any;
    onSetAddingPointType: (type: 'indent' | 'outdent') => void;
    addingPointType: 'indent' | 'outdent' | null;
    onSave: () => void;
    isSaving: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    selectedPuzzleId,
    onPuzzleChange,
    showIds,
    onToggleShowIds,
    onStartLink,
    selectedPoint,
    linkingPoint,
    onSetAddingPointType,
    addingPointType,
    onSave,
    isSaving,
}) => {
    return (
        <div className="bg-white/70 backdrop-blur-sm sticky top-0 z-20 border-b p-4 -mx-4 -mt-4 mb-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Puzzle Configurator</h1>
                <div className="flex items-center gap-2">
                    <select
                        value={selectedPuzzleId}
                        onChange={(e) => onPuzzleChange(parseInt(e.target.value))}
                        className="px-3 py-2 bg-white rounded-lg border border-gray-300 text-black shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="1">Puzzle 1 (2x4)</option>
                        <option value="2">Puzzle 2 (4x4)</option>
                    </select>
                    <button
                        onClick={onToggleShowIds}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        {showIds ? 'Hide IDs' : 'Show IDs'}
                    </button>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    <button
                        onClick={() => onSetAddingPointType('indent')}
                        className={`px-4 py-2 rounded-lg transition-colors font-medium ${addingPointType === 'indent' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 text-blue-500 hover:bg-blue-50'}`}
                    >
                        Add Indent
                    </button>
                    <button
                        onClick={() => onSetAddingPointType('outdent')}
                        className={`px-4 py-2 rounded-lg transition-colors font-medium ${addingPointType === 'outdent' ? 'bg-red-500 text-white' : 'bg-white border border-gray-300 text-red-500 hover:bg-red-50'}`}
                    >
                        Add Outdent
                    </button>
                    <button
                        onClick={onStartLink}
                        disabled={!selectedPoint || !!linkingPoint}
                        className="px-4 py-2 rounded-lg transition-colors font-medium bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Link Point
                    </button>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className={`px-4 py-2 w-24 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}; 