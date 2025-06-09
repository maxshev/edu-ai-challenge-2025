const { Enigma, mod, alphabet, ROTORS, REFLECTOR } = require('./enigma.js');

describe('Enigma Machine Tests', () => {
  describe('Basic Functionality', () => {
    test('should correctly encrypt a single character', () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const result = enigma.process('A');
      expect(result.length).toBe(1);
      expect(result).toMatch(/[A-Z]/);
    });

    test('should preserve non-alphabetic characters', () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const result = enigma.process('A1B2C3');
      expect(result.replace(/[0-9]/g, '').length).toBe(3);
      expect(result.replace(/[A-Z]/g, '')).toBe('123');
    });

    test('should be reversible - decrypt encrypted text', () => {
      const settings = {
        rotors: [0, 1, 2],
        positions: [5, 10, 15],
        rings: [1, 2, 3],
        plugboard: [['A', 'B'], ['C', 'D']]
      };
      
      const enigma1 = new Enigma(
        settings.rotors,
        settings.positions,
        settings.rings,
        settings.plugboard
      );
      
      const enigma2 = new Enigma(
        settings.rotors,
        settings.positions,
        settings.rings,
        settings.plugboard
      );

      const plaintext = 'HELLOWORLD';
      const encrypted = enigma1.process(plaintext);
      const decrypted = enigma2.process(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });
  });

  describe('Rotor Stepping', () => {
    test('should implement double-stepping mechanism', () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      
      // Force middle rotor to notch position
      enigma.rotors[1].position = alphabet.indexOf(enigma.rotors[1].notch);
      
      // Get initial positions
      const initialPos = enigma.rotors.map(r => r.position);
      
      // Process one character to trigger stepping
      enigma.process('A');
      
      // Get final positions
      const finalPos = enigma.rotors.map(r => r.position);
      
      // Verify that both left and middle rotors stepped
      expect(finalPos[0]).toBe(
        mod(initialPos[0] + 1, 26),
        'Left rotor should step when middle rotor is at notch'
      );
      expect(finalPos[1]).toBe(
        mod(initialPos[1] + 1, 26),
        'Middle rotor should step'
      );
    });

    test('should step right rotor on every character', () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const initialPos = enigma.rotors[2].position;
      enigma.process('A');
      expect(enigma.rotors[2].position).toBe(mod(initialPos + 1, 26));
    });
  });

  describe('Plugboard', () => {
    test('should correctly swap letters through plugboard', () => {
      const enigma = new Enigma(
        [0, 1, 2],
        [0, 0, 0],
        [0, 0, 0],
        [['A', 'B'], ['C', 'D']]
      );
      
      const result = enigma.process('ABCD');
      expect(result[0]).not.toBe(result[1]); // A and B should encrypt differently
      expect(result[2]).not.toBe(result[3]); // C and D should encrypt differently
    });
  });

  describe('Ring Settings', () => {
    test('should produce different output with different ring settings', () => {
      const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [1, 1, 1], []);
      
      const input = 'HELLOWORLD';
      const result1 = enigma1.process(input);
      const result2 = enigma2.process(input);
      
      expect(result1).not.toBe(result2);
    });
  });
}); 