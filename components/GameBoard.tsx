
import React from 'react';
import { Coordinates } from '../types';
import { BOARD_SIZE, CELL_SIZE, SNAKE_1_COLOR, FOOD_1_COLOR, SNAKE_2_COLOR, FOOD_2_COLOR } from '../constants';

interface GameBoardProps {
  snake1: Coordinates[];
  snake2: Coordinates[];
  food1: Coordinates;
  food2: Coordinates;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake1, snake2, food1, food2 }) => {
  const boardWidth = BOARD_SIZE * CELL_SIZE;
  const boardHeight = BOARD_SIZE * CELL_SIZE;

  return (
    <div 
      className="relative bg-gray-800 border-4 border-gray-600 rounded-lg shadow-lg"
      style={{ width: `${boardWidth}px`, height: `${boardHeight}px` }}
    >
      {/* Render Snake 1 */}
      {snake1.map((segment, index) => (
        <div
          key={index}
          className={`absolute rounded-sm ${SNAKE_1_COLOR} ${index === 0 ? 'opacity-100' : 'opacity-80'}`}
          style={{ 
            left: `${segment.x * CELL_SIZE}px`, 
            top: `${segment.y * CELL_SIZE}px`, 
            width: `${CELL_SIZE}px`, 
            height: `${CELL_SIZE}px`,
            boxShadow: index === 0 ? '0 0 8px rgba(52, 211, 153, 0.7)' : 'none'
          }}
        />
      ))}

      {/* Render Snake 2 */}
      {snake2.map((segment, index) => (
        <div
          key={index}
          className={`absolute rounded-sm ${SNAKE_2_COLOR} ${index === 0 ? 'opacity-100' : 'opacity-80'}`}
          style={{ 
            left: `${segment.x * CELL_SIZE}px`, 
            top: `${segment.y * CELL_SIZE}px`, 
            width: `${CELL_SIZE}px`, 
            height: `${CELL_SIZE}px`,
            boxShadow: index === 0 ? '0 0 8px rgba(96, 165, 250, 0.7)' : 'none'
          }}
        />
      ))}

      {/* Render Food 1 */}
      <div
        className={`absolute rounded-full ${FOOD_1_COLOR}`}
        style={{
          left: `${food1.x * CELL_SIZE}px`,
          top: `${food1.y * CELL_SIZE}px`,
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`,
          boxShadow: '0 0 12px rgba(167, 243, 208, 0.9)'
        }}
      />
      
      {/* Render Food 2 */}
      <div
        className={`absolute rounded-full ${FOOD_2_COLOR}`}
        style={{
          left: `${food2.x * CELL_SIZE}px`,
          top: `${food2.y * CELL_SIZE}px`,
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`,
          boxShadow: '0 0 12px rgba(191, 219, 254, 0.9)'
        }}
      />
    </div>
  );
};

export default GameBoard;
