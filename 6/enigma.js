const readline = require('readline');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function mod(n, m) {
  return ((n % m) + m) % m;
}

const ROTORS = [
  { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' }, // Rotor I
  { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' }, // Rotor II
  { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' }, // Rotor III
];
const REFLECTOR = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

function plugboardSwap(c, pairs) {
  for (const [a, b] of pairs) {
    if (c === a) return b;
    if (c === b) return a;
  }
  return c;
}

class Rotor {
  constructor(wiring, notch, ringSetting = 0, position = 0) {
    this.wiring = wiring;
    this.notch = notch;
    this.ringSetting = ringSetting;
    this.position = position;
  }
  step() {
    this.position = mod(this.position + 1, 26);
  }
  atNotch() {
    return alphabet[this.position] === this.notch;
  }
  forward(c) {
    // First, apply position offset and ring setting
    let idx = alphabet.indexOf(c);
    idx = mod(idx + this.position - this.ringSetting, 26);
    
    // Pass through the rotor wiring
    const wiringOutput = this.wiring[idx];
    
    // Reverse the position offset and ring setting
    idx = alphabet.indexOf(wiringOutput);
    return alphabet[mod(idx + this.ringSetting - this.position, 26)];
  }
  backward(c) {
    // First, apply position offset and ring setting
    let idx = alphabet.indexOf(c);
    idx = mod(idx + this.position - this.ringSetting, 26);
    
    // Pass through the rotor wiring in reverse
    const wiringIdx = this.wiring.indexOf(alphabet[idx]);
    
    // Reverse the position offset and ring setting
    return alphabet[mod(wiringIdx + this.ringSetting - this.position, 26)];
  }
}

class Enigma {
  constructor(rotorIDs, rotorPositions, ringSettings, plugboardPairs) {
    this.rotors = rotorIDs.map(
      (id, i) =>
        new Rotor(
          ROTORS[id].wiring,
          ROTORS[id].notch,
          ringSettings[i],
          rotorPositions[i],
        ),
    );
    this.plugboardPairs = plugboardPairs;
  }
  stepRotors() {
    // Check notch positions before stepping
    const middleAtNotch = this.rotors[1].atNotch();
    const rightAtNotch = this.rotors[2].atNotch();
    
    // Step the left rotor if middle rotor is at notch
    if (middleAtNotch) {
      this.rotors[0].step();
    }
    
    // Step the middle rotor if either:
    // 1. The right rotor is at notch (normal stepping)
    // 2. The middle rotor itself is at notch (double-stepping)
    if (rightAtNotch || middleAtNotch) {
      this.rotors[1].step();
    }
    
    // Right rotor steps on every key press
    this.rotors[2].step();
  }
  encryptChar(c) {
    if (!alphabet.includes(c)) return c;
    
    // Step rotors first
    this.stepRotors();
    
    // Initial plugboard substitution
    let signal = plugboardSwap(c, this.plugboardPairs);
    
    // Forward path through rotors (right to left)
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      signal = this.rotors[i].forward(signal);
    }
    
    // Reflector
    signal = alphabet[alphabet.indexOf(REFLECTOR[alphabet.indexOf(signal)])];
    
    // Backward path through rotors (left to right)
    for (let i = 0; i < this.rotors.length; i++) {
      signal = this.rotors[i].backward(signal);
    }
    
    // Final plugboard substitution
    return plugboardSwap(signal, this.plugboardPairs);
  }
  process(text) {
    return text
      .toUpperCase()
      .split('')
      .map((c) => this.encryptChar(c))
      .join('');
  }
}

function promptEnigma() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter message: ', (message) => {
    rl.question('Rotor positions (e.g. 0 0 0): ', (posStr) => {
      const rotorPositions = posStr.split(' ').map(Number);
      rl.question('Ring settings (e.g. 0 0 0): ', (ringStr) => {
        const ringSettings = ringStr.split(' ').map(Number);
        rl.question('Plugboard pairs (e.g. AB CD): ', (plugStr) => {
          const plugPairs =
            plugStr
              .toUpperCase()
              .match(/([A-Z]{2})/g)
              ?.map((pair) => [pair[0], pair[1]]) || [];

          const enigma = new Enigma(
            [0, 1, 2],
            rotorPositions,
            ringSettings,
            plugPairs,
          );
          const result = enigma.process(message);
          console.log('Output:', result);
          rl.close();
        });
      });
    });
  });
}

if (require.main === module) {
  promptEnigma();
}

module.exports = {
  Enigma,
  mod,
  alphabet,
  ROTORS,
  REFLECTOR
};
