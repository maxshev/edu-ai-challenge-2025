import { Board } from '../Board';
import { GameConfig } from '../types';

describe('Board', () => {
  let board: Board;
  const config: GameConfig = {
    boardSize: 10,
    numShips: 3,
    shipLength: 3,
  };

  beforeEach(() => {
    board = new Board(config);
  });

  describe('initialization', () => {
    it('should create an empty board of correct size', () => {
      const boardState = board.getBoard();
      expect(boardState.length).toBe(config.boardSize);
      expect(boardState[0].length).toBe(config.boardSize);
      expect(boardState.every(row => row.every(cell => cell === '~'))).toBe(true);
    });
  });

  describe('board operations', () => {
    it('should mark hits correctly', () => {
      board.markHit(5, 5);
      expect(board.getCellValue(5, 5)).toBe('X');
    });

    it('should mark misses correctly', () => {
      board.markMiss(5, 5);
      expect(board.getCellValue(5, 5)).toBe('O');
    });

    it('should validate coordinates correctly', () => {
      expect(board.isValidCoordinate(0, 0)).toBe(true);
      expect(board.isValidCoordinate(9, 9)).toBe(true);
      expect(board.isValidCoordinate(-1, 5)).toBe(false);
      expect(board.isValidCoordinate(5, 10)).toBe(false);
    });
  });

  describe('board display', () => {
    it('should format boards correctly for display', () => {
      const playerBoard = new Board(config).getBoard();
      const cpuBoard = new Board(config).getBoard();
      const display = Board.formatBoardsForDisplay(cpuBoard, playerBoard);

      expect(display).toContain('OPPONENT BOARD');
      expect(display).toContain('YOUR BOARD');
      expect(display.split('\n').length).toBeGreaterThan(config.boardSize);
    });
  });
}); 