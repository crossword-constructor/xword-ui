export const buildPlayableBoard = board => {
  let currentNumber = 1;
  return board.map((row, rowCount) => {
    return row.map((col, colCount) => {
      let number = null;
      if (col === "#BlackSquare#") {
        return { answer: col };
      }
      // Check if this cell gets a number
      else if (
        rowCount === 0 ||
        colCount === 0 ||
        row[colCount - 1] === "#BlackSquare#" ||
        board[rowCount - 1][colCount] === "#BlackSquare#"
      ) {
        number = currentNumber;
        currentNumber++;
      }
      return { guess: "", answer: col, number: number };
    });
  });
};

// Take the current position, direction, keypressed and finds the next cell in that row or col that isn't a blacksquare.
// If it reaches the end of the board it goes back to the beginning

export const searchForValidCell = (row, col, direction, key, board) => {
  let validCellFound;
  while (!validCellFound) {
    if (direction === "across") {
      if (key === "ArrowRight") {
        col += 1;
        if (!board[row][col]) {
          col = 0;
        }
      } else {
        col -= 1;
        if (!board[row][col]) {
          col = board[0].length - 1;
        }
      }
    } else if (direction === "down") {
      if (key === "ArrowDown") {
        row += 1;
        if (!board[row]) {
          row = 0;
        }
      } else {
        row -= 1;
        if (!board[row]) {
          row = board.length - 1;
        }
      }
    }
    if (board[row][col] === "#BlackSquare#") {
      validCellFound = false;
    } else {
      validCellFound = true;
      return [row, col];
    }
  }
};

// Search for end or beginnging of a word
export const searchForBoundaryCell = (row, col, direction, incOrDec, board) => {
  let cell;
  let endCounter = direction === "across" ? col : row;
  let currentCell;
  while (!cell) {
    if (direction === "across") {
      currentCell = board[row][endCounter];
    } else {
      try {
        currentCell = board[parseInt(endCounter)][col];
      } catch (err) {
        currentCell = undefined;
      }
    }
    if (!currentCell || currentCell === "#BlackSquare#") {
      cell = incOrDec === "INCREMENT" ? endCounter - 1 : endCounter + 1;
      return cell;
    }
    if (incOrDec === "INCREMENT") {
      endCounter++;
    } else {
      endCounter--;
    }
  }
};

export default board => {};
