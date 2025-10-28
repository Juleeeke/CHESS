

import React, { useRef, useEffect } from 'react';
import type { Move } from '../types';

interface MoveHistoryProps {
    moves: Move[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [moves]);

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold text-cyan mb-2 text-center">Move History</h2>
            <div ref={scrollRef} className="bg-gray-950 p-3 rounded-md flex-grow overflow-y-auto h-64 lg:h-auto">
                {moves.length === 0 ? (
                    <p className="text-gray-500 text-center italic">No moves yet.</p>
                ) : (
                    <ol className="space-y-1 font-mono text-sm">
                        {/* FIX: Replaced JSX.Element with React.ReactElement to resolve namespace error. */}
                        {moves.reduce<React.ReactElement[]>((acc, move, index) => {
                            if (index % 2 === 0) {
                                acc.push(
                                    <li key={index / 2} className="grid grid-cols-12 gap-2 p-1.5 rounded-md hover:bg-gray-800">
                                        <span className="col-span-2 text-gray-500">{index / 2 + 1}.</span>
                                        <span className="col-span-5 text-gray-200">{move.san}</span>
                                        {moves[index + 1] && <span className="col-span-5 text-gray-200">{moves[index + 1].san}</span>}
                                    </li>
                                );
                            }
                            return acc;
                        }, [])}
                    </ol>
                )}
            </div>
        </div>
    );
};

export default MoveHistory;