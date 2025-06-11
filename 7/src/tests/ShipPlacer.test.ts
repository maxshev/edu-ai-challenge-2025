import { ShipPlacer } from '../ShipPlacer';
import { GameConfig, BoardCell } from '../types';

describe('ShipPlacer', () => {
  let shipPlacer: ShipPlacer;
  let board: BoardCell[][];
  const config: GameConfig = {
    boardSize: 10,
    numShips: 3,
    shipLength: 3,
  };

  beforeEach(() => {
    shipPlacer = new ShipPlacer(config);
    board = Array(config.boardSize)
      .fill(null)
      .map(() => Array(config.boardSize).fill('~'));
  });

  describe('placeShipsRandomly', () => {
    it('should place the correct number of ships', () => {
      const ships = shipPlacer.placeShipsRandomly(board, true);
      expect(ships.length).toBe(config.numShips);
    });

    it('should create ships of correct length', () => {
      const ships = shipPlacer.placeShipsRandomly(board, true);
      ships.forEach(ship => {
        expect(ship.locations.length).toBe(config.shipLength);
        expect(ship.hits.length).toBe(config.shipLength);
      });
    });

    it('should not place ships that overlap', () => {
      const ships = shipPlacer.placeShipsRandomly(board, true);
      const allLocations = new Set<string>();
      
      ships.forEach(ship => {
        ship.locations.forEach(location => {
          expect(allLocations.has(location)).toBe(false);
          allLocations.add(location);
        });
      });
    });

    it('should place ships within board boundaries', () => {
      const ships = shipPlacer.placeShipsRandomly(board, true);
      
      ships.forEach(ship => {
        ship.locations.forEach(location => {
          const row = parseInt(location[0]);
          const col = parseInt(location[1]);
          expect(row).toBeGreaterThanOrEqual(0);
          expect(row).toBeLessThan(config.boardSize);
          expect(col).toBeGreaterThanOrEqual(0);
          expect(col).toBeLessThan(config.boardSize);
        });
      });
    });

    it('should initialize ships with no hits', () => {
      const ships = shipPlacer.placeShipsRandomly(board, true);
      ships.forEach(ship => {
        expect(ship.hits.every(hit => !hit)).toBe(true);
      });
    });

    it('should only mark ships on board when isPlayer is true', () => {
      // Test with isPlayer = true
      const playerBoard = Array(config.boardSize).fill(null).map(() => Array(config.boardSize).fill('~'));
      const playerShips = shipPlacer.placeShipsRandomly(playerBoard, true);
      expect(playerBoard.some(row => row.includes('S'))).toBe(true);

      // Test with isPlayer = false
      const cpuBoard = Array(config.boardSize).fill(null).map(() => Array(config.boardSize).fill('~'));
      const cpuShips = shipPlacer.placeShipsRandomly(cpuBoard, false);
      expect(cpuBoard.every(row => row.every(cell => cell === '~'))).toBe(true);
    });
  });
}); 