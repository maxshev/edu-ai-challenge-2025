import { Ship, GameConfig, BoardCell } from './types';

export class ShipPlacer {
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
  }

  public placeShipsRandomly(board: BoardCell[][]): Ship[] {
    const ships: Ship[] = [];
    let placedShips = 0;

    while (placedShips < this.config.numShips) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const { startRow, startCol } = this.getRandomStartPosition(orientation);
      
      if (this.canPlaceShip(board, startRow, startCol, orientation)) {
        const ship = this.createShip(startRow, startCol, orientation);
        ships.push(ship);
        this.updateBoard(board, ship);
        placedShips++;
      }
    }

    return ships;
  }

  private getRandomStartPosition(orientation: 'horizontal' | 'vertical'): { startRow: number; startCol: number } {
    if (orientation === 'horizontal') {
      return {
        startRow: Math.floor(Math.random() * this.config.boardSize),
        startCol: Math.floor(Math.random() * (this.config.boardSize - this.config.shipLength + 1))
      };
    } else {
      return {
        startRow: Math.floor(Math.random() * (this.config.boardSize - this.config.shipLength + 1)),
        startCol: Math.floor(Math.random() * this.config.boardSize)
      };
    }
  }

  private canPlaceShip(
    board: BoardCell[][],
    startRow: number,
    startCol: number,
    orientation: 'horizontal' | 'vertical'
  ): boolean {
    for (let i = 0; i < this.config.shipLength; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;

      if (row >= this.config.boardSize || col >= this.config.boardSize || board[row][col] !== '~') {
        return false;
      }
    }
    return true;
  }

  private createShip(
    startRow: number,
    startCol: number,
    orientation: 'horizontal' | 'vertical'
  ): Ship {
    const locations: string[] = [];
    const hits: boolean[] = [];

    for (let i = 0; i < this.config.shipLength; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;
      locations.push(`${row}${col}`);
      hits.push(false);
    }

    return { locations, hits };
  }

  private updateBoard(board: BoardCell[][], ship: Ship): void {
    ship.locations.forEach(location => {
      const row = parseInt(location[0]);
      const col = parseInt(location[1]);
      board[row][col] = 'S';
    });
  }
} 