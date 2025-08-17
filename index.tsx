import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// =================================================================================
// TYPES
// =================================================================================

interface Coordinates {
  x: number;
  y: number;
}

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

enum GameState {
  START_SCREEN,
  PLAYING,
  GAME_OVER,
}

enum Player {
    PLAYER_1 = 'Player 1',
    PLAYER_2 = 'Player 2',
    TIE = "It's a Tie!",
}

// =================================================================================
// CONSTANTS
// =================================================================================

const BOARD_SIZE = 25;
const CELL_SIZE = 20; // in pixels
const GAME_SPEED_MS = 120;

const SNAKE_1_COLOR = 'bg-green-500';
const FOOD_1_COLOR = 'bg-green-300';
const SNAKE_2_COLOR = 'bg-blue-500';
const FOOD_2_COLOR = 'bg-blue-300';

const INITIAL_SNAKE_1_POSITION: Coordinates[] = [
  { x: 5, y: 7 },
  { x: 5, y: 6 },
  { x: 5, y: 5 },
];
const INITIAL_SNAKE_1_DIRECTION = Direction.DOWN;

const INITIAL_SNAKE_2_POSITION: Coordinates[] = [
  { x: 19, y: 17 },
  { x: 19, y: 18 },
  { x: 19, y: 19 },
];
const INITIAL_SNAKE_2_DIRECTION = Direction.UP;

const INITIAL_FOOD_1_POSITION: Coordinates = { x: 5, y: 15 };
const INITIAL_FOOD_2_POSITION: Coordinates = { x: 19, y: 9 };


// =================================================================================
// HOOKS
// =================================================================================

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// =================================================================================
// COMPONENTS
// =================================================================================

// GameBoard Component
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


// Scoreboard Component
interface ScoreboardProps {
  score1: number;
  score2: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score1, score2 }) => {
  return (
    <div className="w-full max-w-xl lg:max-w-3xl flex justify-between items-center bg-gray-800 p-4 rounded-lg border-2 border-gray-700 mb-4 text-white font-mono shadow-md">
      <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-3">
        <div className="flex items-center">
            <div className={`w-5 h-5 rounded-sm ${SNAKE_1_COLOR} mr-2`}></div>
            <h2 className="text-lg font-bold text-green-400">Player 1</h2>
        </div>
        <p className="text-sm text-gray-400 mt-1 sm:mt-0">(Arrows)</p>
        <p className="text-2xl font-black text-white">{score1}</p>
      </div>
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

// GameOverModal Component
interface GameOverModalProps {
  winner: Player | null;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, onRestart }) => {
  if (!winner) return null;

  const isTie = winner === Player.TIE;
  const message = isTie ? winner : `${winner} wins!`;
  let colorClass = 'text-yellow-400';
  if (winner === Player.PLAYER_1) colorClass = 'text-green-400';
  else if (winner === Player.PLAYER_2) colorClass = 'text-blue-400';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-gray-600 rounded-xl p-8 text-center shadow-2xl">
        <h2 className="text-4xl font-extrabold text-white mb-2">Game Over</h2>
        <p className={`text-2xl font-bold ${colorClass} mb-6`}>{message}</p>
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


// =================================================================================
// MAIN APP LOGIC
// =================================================================================

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
    if (e.key === 'ArrowUp' && direction1 !== Direction.DOWN) setDirection1(Direction.UP);
    else if (e.key === 'ArrowDown' && direction1 !== Direction.UP) setDirection1(Direction.DOWN);
    else if (e.key === 'ArrowLeft' && direction1 !== Direction.RIGHT) setDirection1(Direction.LEFT);
    else if (e.key === 'ArrowRight' && direction1 !== Direction.LEFT) setDirection1(Direction.RIGHT);
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

    const moveHead = (h: Coordinates, dir: Direction) => {
      let newHead = { ...h };
      switch (dir) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }
      if (newHead.x < 0) newHead.x = BOARD_SIZE - 1;
      if (newHead.x >= BOARD_SIZE) newHead.x = 0;
      if (newHead.y < 0) newHead.y = BOARD_SIZE - 1;
      if (newHead.y >= BOARD_SIZE) newHead.y = 0;
      return newHead;
    };
    head1 = moveHead(head1, direction1);
    head2 = moveHead(head2, direction2);

    const checkCollision = (h1: Coordinates, h2: Coordinates, s1: Coordinates[], s2: Coordinates[]) => {
        for (let i = 1; i < s1.length; i++) if (isSameCoordinates(h1, s1[i])) return Player.PLAYER_2;
        for (let i = 1; i < s2.length; i++) if (isSameCoordinates(h2, s2[i])) return Player.PLAYER_1;
        if (isSameCoordinates(h1, h2)) {
             if (s1.length > s2.length) return Player.PLAYER_1;
             if (s2.length > s1.length) return Player.PLAYER_2;
             return Player.TIE;
        }
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

    // --- Refactored Food and Movement Logic ---
    let snake1Grew = false;
    let snake1Shrunk = false;
    if (isSameCoordinates(head1, food1)) {
      snake1Grew = true;
      setFood1(generateRandomFoodPosition(newSnake1, newSnake2));
    } else if (isSameCoordinates(head1, food2)) {
      snake1Shrunk = true;
      setFood2(generateRandomFoodPosition(newSnake1, newSnake2));
    }

    let snake2Grew = false;
    let snake2Shrunk = false;
    if (isSameCoordinates(head2, food2)) {
      snake2Grew = true;
      setFood2(generateRandomFoodPosition(newSnake1, newSnake2));
    } else if (isSameCoordinates(head2, food1)) {
      snake2Shrunk = true;
      setFood1(generateRandomFoodPosition(newSnake1, newSnake2));
    }

    // Apply movement, growth, or shrinkage
    if (!snake1Grew) {
      newSnake1.pop(); // Standard move pop
    }
    if (snake1Shrunk && newSnake1.length > 0) {
      newSnake1.pop(); // Penalty pop
    }

    if (!snake2Grew) {
      newSnake2.pop(); // Standard move pop
    }
    if (snake2Shrunk && newSnake2.length > 0) {
      newSnake2.pop(); // Penalty pop
    }
    // --- End of Refactored Logic ---
    
    if (newSnake1.length < 1) {
        setWinner(Player.PLAYER_2);
        setGameState(GameState.GAME_OVER);
    } else if(newSnake2.length < 1){
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

// =================================================================================
// RENDERER
// =================================================================================

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);