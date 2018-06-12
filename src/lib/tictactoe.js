import _ from 'lodash';
import Ai from './netttt/ai';
import Neural from './netttt/neural';
import NEURAL_NETWORK from './netttt/neural-network.json';

const playTtt = async (gameState, strategies) => {
  if (strategies[gameState.currentPlayer] === 'human') {
    console.log('Wait for human to play');
    return null;
  } else {
    console.log('Machine is playing...');
    return playAutomatically(gameState, strategies[gameState.currentPlayer]);
  }
};

const playAutomatically = async (gameState, strategy) => {
  console.log(`Play applying ${strategy} strategy, board: ${gameState.ttt.board}`);

  if (!gameState.ttt.ai[gameState.currentPlayer]) {
    switch(strategy) {
      case 'random':
        gameState.ttt.ai[gameState.currentPlayer] = new Ai.Random();
        break;
      case 'easy':
        gameState.ttt.ai[gameState.currentPlayer] = new Ai.Smart(1);
        break;
      case 'smart':
        gameState.ttt.ai[gameState.currentPlayer] = new Ai.Smart();
        break;
      // eslint-disable-next-line no-case-declarations
      case 'neural':
        const net = Neural.Net.import(NEURAL_NETWORK);
        gameState.ttt.ai[gameState.currentPlayer] = new Ai.Neural(net);
        gameState.ttt.emptySquares = () => emptySquares(gameState.ttt.board);
        break;
      case 'neural-go':
        // eslint-disable-next-line no-undef
        play(10);
        console.log('GO engine inited');
        break;
    }
  }

  if (['random', 'easy', 'smart', 'neural'].includes(strategy)) {
    return playJsEngine(gameState);
  } else if (strategy === 'neural-go') {
    console.log(`row index : ${gameState.lastMove.rowIndex}`);
    if (!gameState.ttt.ai[gameState.currentPlayer]) {
      console.log('Return default values for first move');
      gameState.ttt.ai[gameState.currentPlayer] = '👍';
      return {
        rowIndex: 1,
        colIndex: 1,
      };
    } else {
      return await playGoEngine(gameState);
    }
  }
};

const playJsEngine = (gameState) => {
  const aiMove = gameState.ttt.ai[gameState.currentPlayer].getMove(gameState.ttt);
  return {
    rowIndex: Math.floor(aiMove / 3),
    colIndex: aiMove % 3,
  };
};

const playGoEngine = async (gameState) => {
  console.log(`Last move: ${gameState.lastMove.rowIndex + gameState.lastMove.colIndex}`);
  // eslint-disable-next-line no-undef
  await play( ( 3*gameState.lastMove.rowIndex ) + gameState.lastMove.colIndex);
  await sleep(100);

  // eslint-disable-next-line no-undef
  console.log(`output: ${output}`);

  return {
    // eslint-disable-next-line no-undef
    rowIndex: Math.floor(output / 3),
    // eslint-disable-next-line no-undef
    colIndex: output % 3,
  };
};

const checkEndOfGame = (gameState, strategies, animateCells, shakeBoard) => {
  checkWon(gameState, animateCells, shakeBoard);
  checkNull(gameState);

  return gameState.gameEnded;
};

const checkWon = (gameState, animateCells, shakeBoard) => {
  const rowResult = checkRows(gameState);
  const colResult = checkColumns(gameState);
  const diagResult = checkDiagonals(gameState);
  const isNullResult = checkNull(gameState);
  let won = false;
  let cellsToAnimate = [];

  if (rowResult.winner !== '💀') {
    won = true;
    gameState.winner = rowResult.winner;
    cellsToAnimate = [[rowResult.position, 0], [rowResult.position, 1], [rowResult.position, 2]];
  } else if (colResult.winner !== '💀') {
    won = true;
    gameState.winner = colResult.winner;
    cellsToAnimate = [[0, colResult.position], [1, colResult.position], [2, colResult.position]];
  } else if (diagResult.winner !== '💀') {
    won = true;
    gameState.winner = diagResult.winner;
    cellsToAnimate = [[0, 2 * diagResult.position], [1, 1], [2, 2 - 2 * diagResult.position]];
  }

  if (won) {
    gameState.gameEnded = true;
    if (animateCells) {
      animateCells(cellsToAnimate);
    }
  }

  if (isNullResult && !won) {
    gameState.gameEnded = true;
    if (shakeBoard) {
      shakeBoard();
    }
  }
};

const checkRows = (gameState) => {
  return checkLines(gameState.game);
};

const checkColumns = (gameState) => {
  const reversedRowColGameState = [[], [], []];

  for (let rowIndex = 0; rowIndex < gameState.game.length; rowIndex++) {
    for (let colIndex = 0; colIndex < gameState.game.length; colIndex++) {
      reversedRowColGameState[colIndex][rowIndex] = gameState.game[rowIndex][colIndex];
    }
  }

  return checkLines(reversedRowColGameState);
};

const checkDiagonals = (gameState) => {
  const extractedLines = [[
    gameState.game[0][0],
    gameState.game[1][1],
    gameState.game[2][2],
  ], [
    gameState.game[0][2],
    gameState.game[1][1],
    gameState.game[2][0],
  ]];

  return checkLines(extractedLines);
};

const checkLines = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    const reducedRow = checkLine(lines[i]);

    if (reducedRow !== '💀') {
      return {
        winner: reducedRow,
        position: i,
      };
    }
  }

  return {
    winner: '💀',
    position: -1,
  };
};

const checkLine = (line) => {
  return line.reduce((accumulator, currentValue) => {
    if (accumulator === '🏁' && currentValue !== '') {
      accumulator = currentValue;
      return accumulator;
    } else if (currentValue !== accumulator) {
      return '💀';
    }

    return accumulator;
  }, '🏁');
};

const checkNull = (gameState) => {
  const flattened = _.flatten(gameState.game);
  if (!flattened.includes('')) {
    return true;
  }
  return false;
};

const computeOctalBoard = (board, square, piece) => {
  return (board | (piece << (square << 1)));
};

const emptySquares = (board) => {
  const empty = [];
  for (let i = 0; i < 9; ++i, board >>= 2) {
    if ((board & 3) === 0) {
      empty.push(i);
    }
  }
  return empty;
};

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export {
  playTtt,
  checkEndOfGame,
  computeOctalBoard,
};
