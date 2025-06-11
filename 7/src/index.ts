import * as readline from 'readline';
import { Game } from './Game';
import { GameConfig } from './types';

const config: GameConfig = {
  boardSize: 10,
  numShips: 3,
  shipLength: 3,
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function playGame() {
  const game = new Game(config);
  console.log('\nWelcome to Sea Battle!');
  console.log('Enter coordinates as two digits (e.g., 00, 34, 98)');
  console.log(game.getBoardDisplay());

  while (!game.isGameOver()) {
    try {
      const input = await askForInput('Enter your guess (row col): ');
      const playerResult = game.processPlayerGuess(input);
      console.log(playerResult.message);

      if (!game.isGameOver()) {
        console.log('\nCPU is thinking...');
        const cpuResult = game.processCpuTurn();
        console.log(`CPU guessed: ${cpuResult.coordinate.row}${cpuResult.coordinate.col}`);
        console.log(cpuResult.message);
        console.log(game.getBoardDisplay());
      }
    } catch (error) {
      console.error('An error occurred:', error);
      break;
    }
  }

  const winner = game.getWinner();
  console.log(`\nGame Over! ${winner} wins!`);
  rl.close();
}

function askForInput(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

playGame().catch((error) => {
  console.error('Fatal error:', error);
  rl.close();
}); 