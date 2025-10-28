
import React, { useState } from 'react';
import type { GameMode, Difficulty } from '../types';

interface GameControlsProps {
    onNewGame: (mode: GameMode, difficulty: Difficulty, color: 'white' | 'black') => void;
    onUndo: () => void;
    onExport: () => void;
    isThinking: boolean;
}

const ControlButton: React.FC<{ onClick?: () => void; children: React.ReactNode; className?: string; disabled?: boolean }> = ({ onClick, children, className = '', disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center justify-center px-4 py-3 bg-gray-800 rounded-md text-cyan font-semibold transition-all duration-200 ease-in-out hover:bg-blue hover:text-white hover:shadow-glow-blue focus:outline-none focus:ring-2 focus:ring-cyan disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 ${className}`}
    >
        {children}
    </button>
);

const GameControls: React.FC<GameControlsProps> = ({ onNewGame, onUndo, onExport, isThinking }) => {
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState<GameMode>('local');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [color, setColor] = useState<'white' | 'black'>('white');

    const handleStart = () => {
        onNewGame(mode, difficulty, color);
        setShowModal(false);
    };

    return (
        <>
            <div className="space-y-3">
                <ControlButton onClick={() => setShowModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 5v14m-7-7h14"/></svg>
                    New Game
                </ControlButton>
                <ControlButton onClick={onUndo} disabled={isThinking}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l-3 2.7"/></svg>
                    Undo Move
                </ControlButton>
                <ControlButton onClick={onExport} disabled={isThinking}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export PGN
                </ControlButton>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
                        <h2 className="text-2xl font-bold mb-6 text-cyan">New Game Settings</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block mb-2 font-medium text-gray-300">Game Mode</label>
                                <div className="flex space-x-2">
                                    <button onClick={() => setMode('local')} className={`flex-1 py-2 rounded ${mode === 'local' ? 'bg-blue text-white' : 'bg-gray-800'}`}>Local</button>
                                    <button onClick={() => setMode('ai')} className={`flex-1 py-2 rounded ${mode === 'ai' ? 'bg-blue text-white' : 'bg-gray-800'}`}>vs. AI</button>
                                </div>
                            </div>

                            {mode === 'ai' && (
                                <>
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-300">AI Difficulty</label>
                                        <div className="flex space-x-2">
                                            <button onClick={() => setDifficulty('easy')} className={`flex-1 py-2 rounded ${difficulty === 'easy' ? 'bg-blue text-white' : 'bg-gray-800'}`}>Easy</button>
                                            <button onClick={() => setDifficulty('medium')} className={`flex-1 py-2 rounded ${difficulty === 'medium' ? 'bg-blue text-white' : 'bg-gray-800'}`}>Medium</button>
                                            <button onClick={() => setDifficulty('hard')} className={`flex-1 py-2 rounded ${difficulty === 'hard' ? 'bg-blue text-white' : 'bg-gray-800'}`}>Hard</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-300">Your Color</label>
                                        <div className="flex space-x-2">
                                            <button onClick={() => setColor('white')} className={`flex-1 py-2 rounded ${color === 'white' ? 'bg-blue text-white' : 'bg-gray-800'}`}>White</button>
                                            <button onClick={() => setColor('black')} className={`flex-1 py-2 rounded ${color === 'black' ? 'bg-blue text-white' : 'bg-gray-800'}`}>Black</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end mt-8 space-x-4">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-700 rounded text-white hover:bg-gray-600">Cancel</button>
                            <button onClick={handleStart} className="px-6 py-2 bg-cyan rounded text-gray-900 font-bold hover:bg-opacity-80">Start Game</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GameControls;
