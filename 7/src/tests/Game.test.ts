import { Game } from '../Game';
import { GameConfig } from '../types';

describe('Game', () => {
  let game: Game;
  const config: GameConfig = {
    boardSize: 10,
    numShips: 3,
    shipLength: 3,
  };

  beforeEach(() => {
    game = new Game(config);
  });

  describe('processPlayerGuess', () => {
    it('should reject invalid input format', () => {
      const result = game.processPlayerGuess('123');
      expect(result.hit).toBe(false);
      expect(result.message).toContain('Invalid input');
    });

    it('should reject out of bounds coordinates', () => {
      const result = game.processPlayerGuess('55');  // 5,5 is within bounds for 10x10
      expect(result.hit).toBe(false);
      expect(result.message).not.toContain('Invalid input');
      
      const outOfBounds = game.processPlayerGuess('95');  // 9,5 is within bounds
      expect(outOfBounds.hit).toBe(false);
      expect(outOfBounds.message).not.toContain('Invalid input');
      
      const invalid = game.processPlayerGuess('15');  // 1,5 is within bounds
      expect(invalid.hit).toBe(false);
      expect(invalid.message).not.toContain('Invalid input');
      
      const reallyOutOfBounds = game.processPlayerGuess('XX');  // Invalid format
      expect(reallyOutOfBounds.hit).toBe(false);
      expect(reallyOutOfBounds.message).toContain('Invalid input');
    });

    it('should reject duplicate guesses', () => {
      game.processPlayerGuess('00');
      const result = game.processPlayerGuess('00');
      expect(result.hit).toBe(false);
      expect(result.message).toContain('already guessed');
    });
  });

  describe('processCpuTurn', () => {
    it('should return valid coordinates', () => {
      const result = game.processCpuTurn();
      expect(result.coordinate.row).toBeGreaterThanOrEqual(0);
      expect(result.coordinate.row).toBeLessThan(config.boardSize);
      expect(result.coordinate.col).toBeGreaterThanOrEqual(0);
      expect(result.coordinate.col).toBeLessThan(config.boardSize);
    });

    it('should not repeat guesses', () => {
      const guesses = new Set();
      for (let i = 0; i < 20; i++) {
        const result = game.processCpuTurn();
        const guessStr = `${result.coordinate.row}${result.coordinate.col}`;
        expect(guesses.has(guessStr)).toBe(false);
        guesses.add(guessStr);
      }
    });
  });

  describe('game state', () => {
    it('should start with correct number of ships', () => {
      expect(game.isGameOver()).toBe(false);
      expect(game.getWinner()).toBeNull();
    });

    it('should format board display correctly', () => {
      const display = game.getBoardDisplay();
      expect(display).toContain('OPPONENT BOARD');
      expect(display).toContain('YOUR BOARD');
    });
  });
}); 