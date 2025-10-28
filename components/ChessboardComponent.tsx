
import React, { useState, useEffect } from 'react';
import type { Square } from '../types';

// We're using a CDN, so we declare the global variable for TypeScript's benefit.
// The actual object is retrieved from `window` at runtime.
declare global {
    interface Window {
        Chessboard: React.ComponentType<any>;
    }
}

interface ChessboardComponentProps {
    fen: string;
    onPieceDrop: (sourceSquare: Square, targetSquare: Square, piece: string) => boolean;
    boardOrientation: 'white' | 'black';
    isThinking: boolean;
    turn: 'w' | 'b';
}

const ChessboardComponent: React.FC<ChessboardComponentProps> = ({ fen, onPieceDrop, boardOrientation, isThinking, turn }) => {
    // State to track if the external script has loaded.
    const [isScriptLoaded, setIsScriptLoaded] = useState(!!window.Chessboard);

    // Effect to check for the Chessboard library on the window object.
    useEffect(() => {
        if (window.Chessboard) {
            setIsScriptLoaded(true);
            return;
        }

        const interval = setInterval(() => {
            if (window.Chessboard) {
                setIsScriptLoaded(true);
                clearInterval(interval);
            }
        }, 100); // Poll every 100ms

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);
    
    // Retrieve the component from the window object at render time.
    const Chessboard = window.Chessboard;

    if (!isScriptLoaded || !Chessboard) {
        // Fallback UI while the Chessboard library is loading.
        return (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded-lg">
                <p className="text-white animate-pulse">Loading Chessboard...</p>
            </div>
        );
    }
    
    const customDarkSquareStyle = { backgroundColor: '#3d59a1' };
    const customLightSquareStyle = { backgroundColor: '#7dcfff' };

    const turnIndicator = turn === 'w' ? 'White' : 'Black';
    const playerTurn = (turn === boardOrientation[0]);

    return (
        <div className="relative w-full h-full">
            <Chessboard
                id="GeminiChessboard"
                position={fen}
                onPieceDrop={onPieceDrop}
                boardOrientation={boardOrientation}
                customBoardStyle={{
                    borderRadius: '4px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
                }}
                customDarkSquareStyle={customDarkSquareStyle}
                customLightSquareStyle={customLightSquareStyle}
                customPieces={{
                    wP: ({ squareWidth }: { squareWidth: number }) => <img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/merida/wP.svg" style={{ width: squareWidth, height: squareWidth }} />,
                    wN: ({ squareWidth }: { squareWidth: number }) => <img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/merida/wN.svg" style={{ width: squareWidth, height: squareWidth }} />,
                    wB: ({ squareWidth }: { squareWidth: number }) => <img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/merida/wB.svg" style={{ width: squareWidth, height: squareWidth }} />,
                    wR: ({ squareWidth }: { squareWidth: number }) => <img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/merida/wR.svg" style={{ width: squareWidth, height: squareWidth }} />,
                    wQ: ({ squareWidth }: { squareWidth: number }) => <img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/merida/wQ.svg" style={{ width: squareWidth, height: squareWidth }} />,
                    wK: ({ squareWidth }: { squareWidth: number }) => <img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/merida/wK.svg" style={{ width: squareWidth, height: squareWidth }} />,
                    bP: ({ squareWidth }: { squareWidth: number }) => <img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/merida/bP.svg" style={{ width: squareWidth, height: squareWidth }} />,
                    bN: ({ squareWidth }: { squareWidth: number }) => <img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/merida/bN.svg" style={{ width: squareWidth, height: squareWidth }} />,
                    bB: ({ squareWidth }: { squareWidth: number }) => <img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/merida/bB.svg" style={{ width: squareWidth, height: squareWidth }} />,
                    bR: ({ squareWidth }: { squareWidth: number }) => <img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/merida/bR.svg" style={{ width: squareWidth, height: squareWidth }} />,
                    bQ: ({ squareWidth }: { squareWidth: number }) => <img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/merida/bQ.svg" style={{ width: squareWidth, height: squareWidth }} />,
                    bK: ({ squareWidth }: { squareWidth: number }) => <img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/merida/bK.svg" style={{ width: squareWidth, height: squareWidth }} />,
                }}
            />
            {(isThinking || !playerTurn) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                   <div className="text-white text-2xl font-bold p-4 bg-gray-800 bg-opacity-80 rounded-lg">
                      {isThinking ? "AI is thinking..." : `${turnIndicator}'s turn`}
                   </div>
                </div>
            )}
        </div>
    );
};

export default ChessboardComponent;