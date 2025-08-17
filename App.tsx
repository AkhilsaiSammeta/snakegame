
import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import Scoreboard from './components/Scoreboard';
import GameOverModal from './components/GameOverModal';
import { useInterval } from './hooks/useInterval';
import { Coordinates, Direction, GameState, Player } from './types';
import {
  BOARD_SIZE,
  GAME_SPEED_MS,
  INITIAL_SNAKE_1_POSITION,
  INITIAL_SNAKE_1_DIRECTION,
  INITIAL_SNAKE_2_POSITION,
  INITIAL_SNAKE_2_DIRECTION,
  INITIAL_FOOD_1_POSITION,
  INITIAL_FOOD_2_POSITION,
} from './constants';

const isSameCoordinates = (coord1: Coordinates, coord2: Coordinates) => {
    return coord1.x === coord2.x && coord1.y === coord2.y;
};

const generateRandomFoodPosition = (s1: Coordinates[], s2: Coordinates[]): Coordinates => {
    let newFoodPosition: Coordinates;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
        };
    } while (
        s1.some(seg => isSameCoordinates(seg, newFoodPosition)) ||
        s2.some(seg => isSameCoordinates(seg, newFoodPosition))
    );
    return newFoodPosition;
};

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START_SCREEN);
  const [snake1, setSnake1] = useState<Coordinates[]>(INITIAL_SNAKE_1_POSITION);
  const [direction1, setDirection1] = useState<Direction>(INITIAL_SNAKE_1_DIRECTION);
  const [snake2, setSnake2] = useState<Coordinates[]>(INITIAL_SNAKE_2_POSITION);
  const [direction2, setDirection2] = useState<Direction>(INITIAL_SNAKE_2_DIRECTION);
  const [food1, setFood1] = useState<Coordinates>(INITIAL_FOOD_1_POSITION);
  const [food2, setFood2] = useState<Coordinates>(INITIAL_FOOD_2_POSITION);
  const [winner, setWinner] = useState<Player | null>(null);

  const resetGame = useCallback(() => {
    setGameState(GameState.PLAYING);
    setSnake1(INITIAL_SNAKE_1_POSITION);
    setDirection1(INITIAL_SNAKE_1_DIRECTION);
    setSnake2(INITIAL_SNAKE_2_POSITION);
    setDirection2(INITIAL_SNAKE_2_DIRECTION);
    setFood1(INITIAL_FOOD_1_POSITION);
    setFood2(INITIAL_FOOD_2_POSITION);
    setWinner(null);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    // Player 1
    if (e.key === 'ArrowUp' && direction1 !== Direction.DOWN) setDirection1(Direction.UP);
    else if (e.key === 'ArrowDown' && direction1 !== Direction.UP) setDirection1(Direction.DOWN);
    else if (e.key === 'ArrowLeft' && direction1 !== Direction.RIGHT) setDirection1(Direction.LEFT);
    else if (e.key === 'ArrowRight' && direction1 !== Direction.LEFT) setDirection1(Direction.RIGHT);
    // Player 2
    else if ((e.key === 'w' || e.key === 'W') && direction2 !== Direction.DOWN) setDirection2(Direction.UP);
    else if ((e.key === 's' || e.key === 'S') && direction2 !== Direction.UP) setDirection2(Direction.DOWN);
    else if ((e.key === 'a' || e.key === 'A') && direction2 !== Direction.RIGHT) setDirection2(Direction.LEFT);
    else if ((e.key === 'd' || e.key === 'D') && direction2 !== Direction.LEFT) setDirection2(Direction.RIGHT);
  }, [direction1, direction2]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameLoop = () => {
    if (gameState !== GameState.PLAYING) return;

    let newSnake1 = [...snake1];
    let newSnake2 = [...snake2];
    let head1 = { ...newSnake1[0] };
    let head2 = { ...newSnake2[0] };

    // Move Heads
    const moveHead = (h: Coordinates, dir: Direction) => {
      let newHead = { ...h };
      switch (dir) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }
      // Wrap around boundaries
      if (newHead.x < 0) newHead.x = BOARD_SIZE - 1;
      if (newHead.x >= BOARD_SIZE) newHead.x = 0;
      if (newHead.y < 0) newHead.y = BOARD_SIZE - 1;
      if (newHead.y >= BOARD_SIZE) newHead.y = 0;
      return newHead;
    };
    head1 = moveHead(head1, direction1);
    head2 = moveHead(head2, direction2);

    // Collision detection
    const checkCollision = (h1: Coordinates, h2: Coordinates, s1: Coordinates[], s2: Coordinates[]) => {
        // Self collision
        for (let i = 1; i < s1.length; i++) if (isSameCoordinates(h1, s1[i])) return Player.PLAYER_2;
        for (let i = 1; i < s2.length; i++) if (isSameCoordinates(h2, s2[i])) return Player.PLAYER_1;
        // Head-on collision
        if (isSameCoordinates(h1, h2)) {
             if (s1.length > s2.length) return Player.PLAYER_1;
             if (s2.length > s1.length) return Player.PLAYER_2;
             return null; // Tie results in game over for both
        }
        // Snake-on-snake collision
        for (const segment of s2) if (isSameCoordinates(h1, segment)) return Player.PLAYER_2;
        for (const segment of s1) if (isSameCoordinates(h2, segment)) return Player.PLAYER_1;
        return null;
    };

    const collisionWinner = checkCollision(head1, head2, snake1, snake2);
    if (collisionWinner !== null) {
        setWinner(collisionWinner);
        setGameState(GameState.GAME_OVER);
        return;
    }
    
    newSnake1.unshift(head1);
    newSnake2.unshift(head2);

    // Food logic
    // Snake 1 food
    if (isSameCoordinates(head1, food1)) {
        setFood1(generateRandomFoodPosition(newSnake1, newSnake2));
    } else if (isSameCoordinates(head1, food2)) {
        if(newSnake1.length > 2) newSnake1.pop();
        newSnake1.pop();
        setFood2(generateRandomFoodPosition(newSnake1, newSnake2));
    } else {
        newSnake1.pop();
    }
    
    // Snake 2 food
    if (isSameCoordinates(head2, food2)) {
        setFood2(generateRandomFoodPosition(newSnake1, newSnake2));
    } else if (isSameCoordinates(head2, food1)) {
        if(newSnake2.length > 2) newSnake2.pop();
        newSnake2.pop();
        setFood1(generateRandomFoodPosition(newSnake1, newSnake2));
    } else {
        newSnake2.pop();
    }
    
    if (newSnake1.length === 0) {
        setWinner(Player.PLAYER_2);
        setGameState(GameState.GAME_OVER);
    } else if(newSnake2.length === 0){
        setWinner(Player.PLAYER_1);
        setGameState(GameState.GAME_OVER);
    } else {
       setSnake1(newSnake1);
       setSnake2(newSnake2);
    }
  };

  useInterval(gameLoop, gameState === GameState.PLAYING ? GAME_SPEED_MS : null);

  const startGame = () => {
    resetGame();
    setGameState(GameState.PLAYING);
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-mono">
      <h1 className="text-4xl font-extrabold mb-4 tracking-wider text-purple-400">Snake Clash</h1>
      {gameState !== GameState.START_SCREEN && (
        <Scoreboard score1={snake1.length} score2={snake2.length} />
      )}

      {gameState === GameState.START_SCREEN ? (
          <div className="text-center bg-gray-800 p-10 rounded-lg border-2 border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Welcome to Snake Clash!</h2>
              <div className="text-left max-w-md mx-auto space-y-2 mb-8 text-gray-300">
                  <p><span className="font-bold text-green-400">Player 1:</span> Use Arrow Keys to move.</p>
                  <p><span className="font-bold text-blue-400">Player 2:</span> Use WASD Keys to move.</p>
                  <p>Eat your <span className="font-bold">own color</span> bead to grow.</p>
                  <p>Eating the <span className="font-bold">other color</span> shrinks your snake!</p>
                  <p>Avoid crashing into snakes. Last one standing wins!</p>
              </div>
              <button
                  onClick={startGame}
                  className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-transform transform hover:scale-105"
              >
                  Start Game
              </button>
          </div>
      ) : (
        <GameBoard snake1={snake1} snake2={snake2} food1={food1} food2={food2} />
      )}

      {gameState === GameState.GAME_OVER && (
        <GameOverModal winner={winner} onRestart={resetGame} />
      )}
    </div>
  );
}

export default App;
