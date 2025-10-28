
import type { Piece as ChessJsPiece, Square as ChessJsSquare } from 'chess.js';

export type GameMode = 'local' | 'ai';
export type Difficulty = 'easy' | 'medium' | 'hard';

export type Evaluation = {
    evaluation: string;
    winProbabilityWhite: number;
    explanation: string;
};

export type Piece = ChessJsPiece['type'];
export type Color = ChessJsPiece['color'];
export type Square = ChessJsSquare;

export interface Move {
  color: Color;
  from: Square;
  to: Square;
  piece: Piece;
  san: string;
  flags: string;
}
