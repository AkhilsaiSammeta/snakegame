
import React from 'react';
import { Player } from '../types';

interface GameOverModalProps {
  winner: Player | null;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, onRestart }) => {
  if (!winner) return null;

  const winnerColor = winner === Player.PLAYER_1 ? 'text-green-400' : 'text-blue-400';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-gray-600 rounded-xl p-8 text-center shadow-2xl transform transition-all animate-fade-in-down">
        <h2 className="text-4xl font-extrabold text-white mb-2">Game Over</h2>
        <p className={`text-2xl font-bold ${winnerColor} mb-6`}>
          {winner} wins!
        </p>
        <button
          onClick={onRestart}
          className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-transform transform hover:scale-105"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
