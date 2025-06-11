import { GameConfig, GameState, Ship, Coordinate } from './types';
import { Board } from './Board';
import { ShipPlacer } from './ShipPlacer';

export class Game {
  private config: GameConfig;
  private state: GameState;
  private playerBoard: Board;
  private cpuBoard: Board;
  private shipPlacer: ShipPlacer;

  constructor(config: GameConfig) {
    this.config = config;
    this.playerBoard = new Board(config);
    this.cpuBoard = new Board(config);
    this.shipPlacer = new ShipPlacer(config);
    this.state = this.initializeGameState();
  }

  private initializeGameState(): GameState {
    const playerShips = this.shipPlacer.placeShipsRandomly(this.playerBoard.getBoard(), true);
    const cpuShips = this.shipPlacer.placeShipsRandomly(this.cpuBoard.getBoard(), false);

    return {
      playerShips,
      cpuShips,
      playerNumShips: this.config.numShips,
      cpuNumShips: this.config.numShips,
      playerBoard: this.playerBoard.getBoard(),
      cpuBoard: this.cpuBoard.getBoard(),
      guesses: new Set<string>(),
      cpuGuesses: new Set<string>(),
      cpuMode: 'hunt',
      cpuTargetQueue: [],
    };
  }

  public processPlayerGuess(input: string): { hit: boolean; message: string } {
    // First check basic input format
    if (!input || input.length !== 2) {
      return { hit: false, message: 'Invalid input. Please enter two digits (e.g., 00, 34).' };
    }

    const row = parseInt(input[0]);
    const col = parseInt(input[1]);

    // Check if the input contains valid numbers
    if (isNaN(row) || isNaN(col)) {
      return { hit: false, message: 'Invalid input. Please enter valid numbers.' };
    }

    // Check if coordinates are within bounds
    if (row >= this.config.boardSize || col >= this.config.boardSize || row < 0 || col < 0) {
      return { hit: false, message: 'Invalid input. Coordinates must be between 0 and ' + (this.config.boardSize - 1) + '.' };
    }

    const guessStr = `${row}${col}`;
    if (this.state.guesses.has(guessStr)) {
      return { hit: false, message: 'You already guessed that location!' };
    }

    this.state.guesses.add(guessStr);
    return this.processGuess(row, col, true);
  }

  public processCpuTurn(): { hit: boolean; message: string; coordinate: Coordinate } {
    let row: number, col: number, guessStr: string;

    do {
      if (this.state.cpuMode === 'target' && this.state.cpuTargetQueue.length > 0) {
        guessStr = this.state.cpuTargetQueue.shift()!;
        row = parseInt(guessStr[0]);
        col = parseInt(guessStr[1]);
      } else {
        row = Math.floor(Math.random() * this.config.boardSize);
        col = Math.floor(Math.random() * this.config.boardSize);
        guessStr = `${row}${col}`;
      }
    } while (this.state.cpuGuesses.has(guessStr));

    this.state.cpuGuesses.add(guessStr);
    const result = this.processGuess(row, col, false);

    if (result.hit && this.state.cpuMode === 'hunt') {
      this.state.cpuMode = 'target';
      this.addAdjacentCoordinatesToQueue(row, col);
    }

    return { ...result, coordinate: { row, col } };
  }

  private processGuess(row: number, col: number, isPlayer: boolean): { hit: boolean; message: string } {
    const board = isPlayer ? this.cpuBoard : this.playerBoard;
    
    if (!board.isValidCoordinate(row, col)) {
      return { hit: false, message: 'Invalid input. Coordinates must be between 0 and ' + (this.config.boardSize - 1) + '.' };
    }

    const ships = isPlayer ? this.state.cpuShips : this.state.playerShips;
    const guessStr = `${row}${col}`;

    for (const ship of ships) {
      const hitIndex = ship.locations.indexOf(guessStr);
      if (hitIndex >= 0 && !ship.hits[hitIndex]) {
        ship.hits[hitIndex] = true;
        board.markHit(row, col);

        if (this.isShipSunk(ship)) {
          if (isPlayer) {
            this.state.cpuNumShips--;
          } else {
            this.state.playerNumShips--;
          }
          return {
            hit: true,
            message: `${isPlayer ? 'You' : 'CPU'} sunk a battleship!`,
          };
        }

        return {
          hit: true,
          message: `${isPlayer ? 'PLAYER' : 'CPU'} HIT!`,
        };
      }
    }

    board.markMiss(row, col);
    return {
      hit: false,
      message: `${isPlayer ? 'PLAYER' : 'CPU'} MISS.`,
    };
  }

  private isValidInput(input: string): boolean {
    if (!input || input.length !== 2) return false;
    const row = parseInt(input[0]);
    const col = parseInt(input[1]);
    return (
      !isNaN(row) &&
      !isNaN(col) &&
      row >= 0 &&
      row < this.config.boardSize &&
      col >= 0 &&
      col < this.config.boardSize
    );
  }

  private isShipSunk(ship: Ship): boolean {
    return ship.hits.every(hit => hit);
  }

  private addAdjacentCoordinatesToQueue(row: number, col: number): void {
    const adjacent = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];

    for (const coord of adjacent) {
      if (
        this.playerBoard.isValidCoordinate(coord.row, coord.col) &&
        !this.state.cpuGuesses.has(`${coord.row}${coord.col}`)
      ) {
        this.state.cpuTargetQueue.push(`${coord.row}${coord.col}`);
      }
    }
  }

  public isGameOver(): boolean {
    return this.state.playerNumShips === 0 || this.state.cpuNumShips === 0;
  }

  public getWinner(): string | null {
    if (!this.isGameOver()) return null;
    return this.state.playerNumShips === 0 ? 'CPU' : 'Player';
  }

  public getBoardDisplay(): string {
    return Board.formatBoardsForDisplay(this.cpuBoard.getBoard(), this.playerBoard.getBoard());
  }
} 