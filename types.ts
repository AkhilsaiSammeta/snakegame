
export interface Coordinates {
  x: number;
  y: number;
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export enum GameState {
  START_SCREEN,
  PLAYING,
  GAME_OVER,
}

export enum Player {
    PLAYER_1 = 'Player 1',
    PLAYER_2 = 'Player 2',
}
