import _ from 'lodash';

const play = (gameState, strategies) => {
  if (strategies[gameState.currentPlayer] === 'human') {
    console.log('Wait for human to play');
    return null;
  } else {
    console.log('Machine is playing...');
    return playAutomatically(gameState.game, strategies[gameState.currentPlayer]);
  }
};

const playAutomatically = (game, strategy) => {
  console.log(`Play applying ${strategy} strategy`);

  // Find first empty cell
  for (let rowIndex = 0; rowIndex < game.length; rowIndex++) {
    for (let colIndex = 0; colIndex < game.length; colIndex++) {
      if (game[rowIndex][colIndex] === '') {
        return {
          rowIndex,
          colIndex,
        };
      }
    } 
  }
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

export {
  play,
  checkEndOfGame,
};
