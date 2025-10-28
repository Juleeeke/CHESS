

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import type { GameMode, Difficulty, Evaluation, Move, Piece, Square } from './types';
import { getAIBestMove, evaluateMove } from './services/geminiService';
import ChessboardComponent from './components/ChessboardComponent';
import GameControls from './components/GameControls';
import MoveHistory from './components/MoveHistory';
import EvaluationBar from './components/EvaluationBar';
import GameStatusModal from './components/GameStatusModal';

const App: React.FC = () => {
    const game = useMemo(() => new Chess(), []);
    const [fen, setFen] = useState<string>(game.fen());
    const [history, setHistory] = useState<Move[]>([]);
    const [gameMode, setGameMode] = useState<GameMode>('local');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const [evaluation, setEvaluation] = useState<Evaluation>({
        winProbabilityWhite: 50,
        evaluation: 'Even',
        explanation: 'The position is balanced.',
    });
    const [gameOver, setGameOver] = useState<{ status: string; winner?: string } | null>(null);

    const checkGameOver = useCallback(() => {
        if (game.isGameOver()) {
            let status = '';
            let winner: string | undefined;
            if (game.isCheckmate()) {
                status = 'Checkmate';
                winner = game.turn() === 'w' ? 'Black' : 'White';
            } else if (game.isDraw()) {
                status = 'Draw';
            } else if (game.isStalemate()) {
                status = 'Stalemate';
            } else if (game.isThreefoldRepetition()) {
                status = 'Threefold Repetition';
            }
            setGameOver({ status, winner });
        }
    }, [game]);

    const handleAITurn = useCallback(async () => {
        if (gameMode !== 'ai' || game.turn() === playerColor[0]) {
            return;
        }
        setIsThinking(true);
        try {
            const aiMove = await getAIBestMove(game.fen(), difficulty);
            const moveResult = game.move(aiMove);
            if (moveResult) {
                setFen(game.fen());
                const newHistory = game.history({ verbose: true }) as Move[];
                setHistory(newHistory);
                const lastMove = newHistory[newHistory.length - 1];
                const pgn = game.pgn();
                const newEvaluation = await evaluateMove(pgn);
                setEvaluation(newEvaluation);
            }
        } catch (error) {
            console.error("Error getting AI move:", error);
            // Handle error, maybe show a message to the user
        } finally {
            setIsThinking(false);
            checkGameOver();
        }
    }, [game, gameMode, playerColor, difficulty, checkGameOver]);

    useEffect(() => {
        if (gameMode === 'ai' && game.turn() !== playerColor[0] && !game.isGameOver()) {
            const timer = setTimeout(handleAITurn, 500);
            return () => clearTimeout(timer);
        }
    }, [fen, gameMode, playerColor, game, handleAITurn]);

    // FIX: Changed onDrop to be synchronous and handle async evaluation separately to match prop type.
    const onDrop = (sourceSquare: Square, targetSquare: Square, piece: string) => {
        if (isThinking) return false;

        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q', // Always promote to a queen for simplicity
        };

        try {
            const moveResult = game.move(moveData);
            if (moveResult === null) {
                return false; // illegal move
            }

            setFen(game.fen());
            const newHistory = game.history({ verbose: true }) as Move[];
            setHistory(newHistory);

            const evaluate = async () => {
                setIsThinking(true);
                try {
                    const pgn = game.pgn();
                    const newEvaluation = await evaluateMove(pgn);
                    setEvaluation(newEvaluation);
                } catch (evalError) {
                    console.error("Error evaluating move:", evalError);
                } finally {
                    setIsThinking(false);
                    checkGameOver();
                }
            };
            evaluate();
            return true;
        } catch (error) {
            return false;
        }
    };
    
    const startNewGame = useCallback((mode: GameMode, diff: Difficulty, color: 'white' | 'black') => {
        game.reset();
        setFen(game.fen());
        setHistory([]);
        setGameMode(mode);
        setDifficulty(diff);
        setPlayerColor(color);
        setGameOver(null);
        setEvaluation({
            winProbabilityWhite: 50,
            evaluation: 'Even',
            explanation: 'A new game has begun.',
        });
        if (mode === 'ai' && color === 'black') {
            handleAITurn();
        }
    }, [game, handleAITurn]);

    const handleUndo = () => {
        game.undo();
        if (gameMode === 'ai' && history.length > 1) {
            game.undo();
        }
        setFen(game.fen());
        setHistory(game.history({ verbose: true }) as Move[]);
    };

    const handleExport = () => {
        const pgn = game.pgn();
        const blob = new Blob([pgn], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gemini-chess-game-${Date.now()}.pgn`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col items-center justify-center p-2 sm:p-4">
            {gameOver && <GameStatusModal gameOver={gameOver} onNewGame={() => setGameOver(null)} />}
            <main className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 w-full max-w-7xl">
                <div className="lg:col-span-3 order-2 lg:order-1 bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col">
                    <GameControls
                        onNewGame={startNewGame}
                        onUndo={handleUndo}
                        onExport={handleExport}
                        isThinking={isThinking}
                    />
                    <div className="mt-4 flex-grow">
                        <MoveHistory moves={history} />
                    </div>
                </div>

                <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-cyan mb-4 tracking-wider font-mono">GEMINI CHESS</h1>
                    <div className="w-full aspect-square shadow-glow-cyan rounded-lg overflow-hidden">
                       <ChessboardComponent
                            fen={fen}
                            onPieceDrop={onDrop}
                            boardOrientation={playerColor}
                            isThinking={isThinking}
                            turn={game.turn()}
                       />
                    </div>
                </div>

                <div className="lg:col-span-3 order-3 lg:order-3 bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col justify-center items-center">
                    <h2 className="text-xl font-bold text-cyan mb-4">Evaluation</h2>
                    <EvaluationBar winRate={evaluation.winProbabilityWhite} />
                    <div className="text-center mt-4">
                        <p className="text-2xl font-bold">{evaluation.evaluation}</p>
                        <p className="text-gray-400 mt-2 text-sm">{evaluation.explanation}</p>
                    </div>
                    {isThinking && (
                        <div className="mt-auto pt-4 text-center">
                            <div className="animate-pulse text-cyan">Gemini is thinking...</div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;