
import React from 'react';

interface GameStatusModalProps {
    gameOver: {
        status: string;
        winner?: string;
    };
    onNewGame: () => void;
}

const GameStatusModal: React.FC<GameStatusModalProps> = ({ gameOver, onNewGame }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-gray-900 border border-cyan shadow-glow-cyan p-8 rounded-lg text-center transform scale-100 transition-transform duration-300">
                <h2 className="text-4xl font-bold text-cyan mb-4">{gameOver.status}</h2>
                {gameOver.winner && <p className="text-2xl mb-6">{gameOver.winner} wins!</p>}
                <button
                    onClick={onNewGame}
                    className="px-8 py-3 bg-cyan text-gray-900 font-bold rounded-md transition-transform hover:scale-105"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default GameStatusModal;
