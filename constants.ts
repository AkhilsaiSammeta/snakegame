
import { Coordinates, Direction } from './types';

export const BOARD_SIZE = 25;
export const CELL_SIZE = 20; // in pixels
export const GAME_SPEED_MS = 120;

export const SNAKE_1_COLOR = 'bg-green-500';
export const FOOD_1_COLOR = 'bg-green-300';
export const SNAKE_2_COLOR = 'bg-blue-500';
export const FOOD_2_COLOR = 'bg-blue-300';

export const INITIAL_SNAKE_1_POSITION: Coordinates[] = [
  { x: 5, y: 5 },
  { x: 5, y: 6 },
  { x: 5, y: 7 },
];
export const INITIAL_SNAKE_1_DIRECTION = Direction.UP;

export const INITIAL_SNAKE_2_POSITION: Coordinates[] = [
  { x: 19, y: 19 },
  { x: 19, y: 18 },
  { x: 19, y: 17 },
];
export const INITIAL_SNAKE_2_DIRECTION = Direction.DOWN;

export const INITIAL_FOOD_1_POSITION: Coordinates = { x: 5, y: 15 };
export const INITIAL_FOOD_2_POSITION: Coordinates = { x: 19, y: 9 };
