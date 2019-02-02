import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import crossword from "./crossword.json";
import "./App.css";

// Converts the object structure of board to store guesses next to answers
const buildPlayableBoard = board => {
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
        row[colCount - 1] === "#BlackSquare#" ||
        board[rowCount - 1][colCount] === "#BlackSquare#"
      ) {
        console.log("incrementing current counte");
        number = currentNumber;
        currentNumber++;
      }
      return { guess: "", answer: col, number: number };
    });
  });
};

const App = () => {
  const [direction, setDirection] = useState("across");
  const [wordCoords, setWordCoords] = useState([0, 0]);
  const [currentCoords, setCurrentCoords] = useState([0, 0]);
  const [rebusPosition, setRebus] = useState(null);
  const [board, updateBoard] = useState([]);

  useEffect(() => {
    let board = buildPlayableBoard(crossword.board);
    updateBoard(board);
    console.log(board);
  }, []);

  useEffect(() => {
    console.log("init listener");
    document.addEventListener("keydown", keyListener);
    // setSelected(currentCoords[0], currentCoords[0])
    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  });

  function keyListener(event) {
    let newDirection = direction;
    let code = event.code;
    let [row, col] = currentCoords;
    let keyCode = event.keyCode;
    let nextCoords = [row, col];
    if (code === "Insert") {
      return setRebus(true);
      // Check for change of direction
    } else if (/^[a-z0-9._]+$/i.test(event.key) && event.key.length === 1) {
      // INSERT GUESS
      let newBoard = { ...board };
      newBoard[row][col].guess = event.key;
      console.log("up[dating board ", event.key);
      updateBoard(newBoard);
      // After inserting a letter move to the next position by making this key listener think the arrow key was pressed
      if (direction === "down") code = "ArrowDown";
      else code = "ArrowRight";
    }
    if (
      (code === "ArrowRight" || code === "ArrowLeft") &&
      direction === "down"
    ) {
      newDirection = "across";
    } else if (
      (code === "ArrowDown" || code === "ArrowUp") &&
      direction === "across"
    ) {
      newDirection = "down";
    } else if (
      code === "ArrowRight" ||
      code === "ArrowLeft" ||
      code === "ArrowDown" ||
      code === "ArrowUp"
    ) {
      let nextCell = searchForValidCell(
        row,
        col,
        direction,
        code,
        crossword.board
      );
      let { wordBeg, wordEnd } = setSelected(
        nextCell[0],
        nextCell[1],
        newDirection
      );
      setWordCoords([wordBeg, wordEnd]);
      setCurrentCoords(nextCell);
      return;
    }
    let { wordBeg, wordEnd } = setSelected(row, col, newDirection);
    setCurrentCoords([row, col]);
    setDirection(newDirection);
    setWordCoords([wordBeg, wordEnd]);

    // console.log('should not see this')
    // updatePosition(increment, decrement)
  }

  const setSelected = (row, col, newDirection) => {
    // Toggle direction if clicking active sqaure
    let wordEnd = searchForBoundaryCell(row, col, newDirection, "INCREMENT");
    let wordBeg = searchForBoundaryCell(row, col, newDirection, "DECREMENT");
    return { wordBeg, wordEnd };
  };

  // Take the current position, direction, keypressed and finds the next cell in that row or col that isn't a blacksquare.
  // If it reaches the end of the board it goes back to the beginning
  const searchForValidCell = (row, col, direction, key, board) => {
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
  const searchForBoundaryCell = (row, col, direction, incOrDec) => {
    let cell;
    let endCounter = direction === "across" ? col : row;
    let currentCell;
    while (!cell) {
      if (direction === "across") {
        currentCell = crossword.board[row][endCounter];
      } else {
        try {
          currentCell = crossword.board[parseInt(endCounter)][col];
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

  const clickListener = (rowNum, colNum) => {
    let newDirection = direction;
    if (rowNum === currentCoords[0] && colNum === currentCoords[1]) {
      // toggle direction
      newDirection = direction === "across" ? "down" : "across";
    }
    let { wordBeg, wordEnd } = setSelected(rowNum, colNum, newDirection);
    setCurrentCoords([rowNum, colNum]);
    setDirection(newDirection);
    setWordCoords([wordBeg, wordEnd]);
  };

  let rows = Object.keys(board).map((row, rowNum) => {
    return (
      <tr className="row">
        {board[row].map((cell, colNum) => {
          let black = cell.answer === "#BlackSquare#";
          let highlighted = false;
          if (direction === "across") {
            if (
              colNum >= wordCoords[0] &&
              colNum <= wordCoords[1] &&
              rowNum === currentCoords[0]
            ) {
              highlighted = true;
            }
          } else {
            if (
              rowNum >= wordCoords[0] &&
              rowNum <= wordCoords[1] &&
              colNum === currentCoords[1]
            ) {
              highlighted = true;
            }
          }
          return black ? (
            <td className="black" />
          ) : (
            <Cell
              highlighted={highlighted}
              focus={currentCoords[0] === rowNum && currentCoords[1] === colNum}
              answer={cell.answer}
              guess={cell.guess}
              number={cell.number}
              coords={[rowNum, colNum]}
              click={() => clickListener(rowNum, colNum)}
            />
          );
        })}
      </tr>
    );
  });
  return (
    <div className="page">
      <table>
        <tbody className="board">{rows}</tbody>
      </table>
      <div className="clues">
        <div className="acrossClues">
          {crossword.clues
            .filter(clue => clue.position.indexOf("A") > -1)
            .map(clue => {
              return <div className="clue">{clue.position}</div>;
            })}
        </div>
        <div className="downClues">
          {crossword.clues
            .filter(clue => clue.position.indexOf("D") > -1)
            .map(clue => {
              return <div className="clue">{clue.position}</div>;
            })}
        </div>
      </div>
    </div>
  );
};

// position = [row, col]
// incOrDec = increment or decrement

export default App;
