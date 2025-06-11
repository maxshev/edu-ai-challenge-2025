import { BoardCell, Ship, GameConfig } from './types';

export class Board {
  private board: BoardCell[][];
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
    this.board = this.createBoard();
  }

  private createBoard(): BoardCell[][] {
    return Array(this.config.boardSize)
      .fill(null)
      .map(() => Array(this.config.boardSize).fill('~'));
  }

  public getBoard(): BoardCell[][] {
    return this.board;
  }

  public placeShip(ship: Ship, isPlayer: boolean): void {
    ship.locations.forEach((location, index) => {
      const row = parseInt(location[0]);
      const col = parseInt(location[1]);
      if (isPlayer) {
        this.board[row][col] = 'S';
      }
    });
  }

  public markHit(row: number, col: number): void {
    this.board[row][col] = 'X';
  }

  public markMiss(row: number, col: number): void {
    this.board[row][col] = 'O';
  }

  public isValidCoordinate(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.config.boardSize &&
      col >= 0 &&
      col < this.config.boardSize
    );
  }

  public getCellValue(row: number, col: number): BoardCell {
    return this.board[row][col];
  }

  public static formatBoardsForDisplay(
    cpuBoard: BoardCell[][],
    playerBoard: BoardCell[][],
  ): string {
    let display = '\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---\n';
    const header = '  ' + [...Array(cpuBoard.length)].map((_, i) => i).join(' ');
    display += header + '     ' + header + '\n';

    for (let i = 0; i < cpuBoard.length; i++) {
      let row = `${i} `;
      for (let j = 0; j < cpuBoard[i].length; j++) {
        row += cpuBoard[i][j] + ' ';
      }
      row += `   ${i} `;
      for (let j = 0; j < playerBoard[i].length; j++) {
        row += playerBoard[i][j] + ' ';
      }
      display += row + '\n';
    }
    return display + '\n';
  }
} 