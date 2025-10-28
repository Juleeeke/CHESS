
import React from 'react';

interface EvaluationBarProps {
    winRate: number; // Win rate for white, from 0 to 100
}

const EvaluationBar: React.FC<EvaluationBarProps> = ({ winRate }) => {
    const whiteHeight = `${winRate}%`;
    const blackHeight = `${100 - winRate}%`;

    return (
        <div className="w-12 h-64 bg-gray-950 rounded-full overflow-hidden flex flex-col shadow-inner">
            <div
                className="w-full bg-gray-700 transition-all duration-500 ease-in-out flex items-end justify-center"
                style={{ height: blackHeight }}
            >
               <span className="text-white font-bold transform -rotate-90 origin-center whitespace-nowrap py-4">{Math.round(100 - winRate)}</span>
            </div>
            <div
                className="w-full bg-cyan transition-all duration-500 ease-in-out flex items-start justify-center"
                style={{ height: whiteHeight }}
            >
               <span className="text-gray-950 font-bold transform -rotate-90 origin-center whitespace-nowrap py-4">{Math.round(winRate)}</span>
            </div>
        </div>
    );
};

export default EvaluationBar;
