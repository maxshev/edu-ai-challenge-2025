export type Coordinate = {
  row: number;
  col: number;
};

export type Ship = {
  locations: string[];
  hits: boolean[];
};

export type BoardCell = '~' | 'S' | 'X' | 'O';

export type GameMode = 'hunt' | 'target';

export interface GameConfig {
  boardSize: number;
  numShips: number;
  shipLength: number;
}

export interface GameState {
  playerShips: Ship[];
  cpuShips: Ship[];
  playerNumShips: number;
  cpuNumShips: number;
  playerBoard: BoardCell[][];
  cpuBoard: BoardCell[][];
  guesses: Set<string>;
  cpuGuesses: Set<string>;
  cpuMode: GameMode;
  cpuTargetQueue: string[];
} 