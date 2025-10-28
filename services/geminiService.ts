
import { GoogleGenAI, Type } from "@google/genai";
import type { Difficulty, Evaluation } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const evaluationSchema = {
    type: Type.OBJECT,
    properties: {
        evaluation: {
            type: Type.STRING,
            description: "A single-word evaluation from this list: 'Brilliant', 'Great', 'Good', 'Inaccuracy', 'Mistake', 'Blunder', 'Even'."
        },
        winProbabilityWhite: {
            type: Type.NUMBER,
            description: "The win probability for White as a percentage (number from 0 to 100)."
        },
        explanation: {
            type: Type.STRING,
            description: "A brief, one-sentence explanation for the evaluation."
        }
    },
    required: ["evaluation", "winProbabilityWhite", "explanation"]
};

export const evaluateMove = async (pgn: string): Promise<Evaluation> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a chess analysis engine. Your task is to evaluate the last move of a chess game provided in PGN format. The current player to move has just completed their turn. Analyze the final move and provide:
1. A single-word evaluation from this list: "Brilliant", "Great", "Good", "Inaccuracy", "Mistake", "Blunder", "Even".
2. The win probability for White as a percentage (number from 0 to 100).
3. A brief, one-sentence explanation for your evaluation.
Here is the game PGN:
${pgn}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: evaluationSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as Evaluation;

    } catch (error) {
        console.error("Error evaluating move with Gemini:", error);
        return {
            evaluation: 'Error',
            winProbabilityWhite: 50,
            explanation: 'Could not get evaluation from AI.',
        };
    }
};

const getDifficultyPrompt = (difficulty: Difficulty): string => {
    switch (difficulty) {
        case 'easy':
            return "You are a beginner chess player (around 800 ELO). Suggest a plausible but likely suboptimal move. Avoid obvious blunders, but choose a move a novice might make.";
        case 'medium':
            return "You are an intermediate club chess player (around 1500 ELO). Suggest a strong, solid move.";
        case 'hard':
            return "You are a world-class chess engine (like Stockfish, 3000+ ELO). Determine the absolute best possible move.";
    }
};


export const getAIBestMove = async (fen: string, difficulty: Difficulty): Promise<string> => {
    try {
        const systemInstruction = getDifficultyPrompt(difficulty);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Given the following FEN string, determine the best move for the current player. Respond ONLY with the move in Standard Algebraic Notation (SAN), for example: "Nf3", "e4", "O-O", "bxc8=Q".
FEN: ${fen}`,
            config: {
                systemInstruction,
                temperature: 0.2,
                maxOutputTokens: 10,
            }
        });

        const move = response.text.trim();
        // Basic validation for SAN format
        if (!/^[a-h]?[1-8]?x?[a-h][1-8](=[QRBN])?(\+|#)?$|^O-O(-O)?$/.test(move) && !/^[A-Z]/.test(move)) {
             // A fallback for more complex notations like "Nf3"
             if (!/^[NBRQK][a-h]?[1-8]?x?[a-h][1-8](\+|#)?$/.test(move)) {
                 console.warn("Received potentially invalid SAN from AI:", move);
             }
        }
        return move;

    } catch (error) {
        console.error("Error getting AI move from Gemini:", error);
        // Fallback to a random legal move if API fails (requires chess instance)
        // This part cannot be implemented here as we don't have the game instance.
        // The calling component should handle this error.
        throw new Error("Failed to get AI move.");
    }
};
