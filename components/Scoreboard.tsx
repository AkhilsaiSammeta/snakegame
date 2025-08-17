
import React from 'react';
import { SNAKE_1_COLOR, SNAKE_2_COLOR } from '../constants';

interface ScoreboardProps {
  score1: number;
  score2: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score1, score2 }) => {
  return (
    <div className="w-full max-w-xl lg:max-w-3xl flex justify-between items-center bg-gray-800 p-4 rounded-lg border-2 border-gray-700 mb-4 text-white font-mono shadow-md">
      {/* Player 1 Info */}
      <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-3">
        <div className="flex items-center">
            <div className={`w-5 h-5 rounded-sm ${SNAKE_1_COLOR} mr-2`}></div>
            <h2 className="text-lg font-bold text-green-400">Player 1</h2>
        </div>
        <p className="text-sm text-gray-400 mt-1 sm:mt-0">(Arrows)</p>
        <p className="text-2xl font-black text-white">{score1}</p>
      </div>

      {/* Player 2 Info */}
       <div className="flex flex-col sm:flex-row-reverse items-center space-x-0 sm:space-x-3 sm:space-x-reverse">
         <div className="flex items-center">
            <div className={`w-5 h-5 rounded-sm ${SNAKE_2_COLOR} mr-2 sm:mr-0 sm:ml-2`}></div>
            <h2 className="text-lg font-bold text-blue-400">Player 2</h2>
        </div>
        <p className="text-sm text-gray-400 mt-1 sm:mt-0">(WASD)</p>
        <p className="text-2xl font-black text-white">{score2}</p>
      </div>
    </div>
  );
};

export default Scoreboard;
