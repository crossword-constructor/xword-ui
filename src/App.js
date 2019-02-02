import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import crossword from "./crossword.json";
import "./App.css";

const App = () => {
  const [direction, setDirection] = useState("across");
  const [wordCoords, setWordCoords] = useState([0, 0]);
  const [currentCoords, setCurrentCoords] = useState([0, 0]);
  const [rebusPosition, setRebus] = useState(null);

  useEffect(() => {
    document.addEventListener("keydown", keyListener);
    // setSelected(currentCoords[0], currentCoords[0])
    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  });

  async function keyListener(event) {
    let newDirection = direction;
    let [row, col] = currentCoords;
    let nextCoords = [row, col];
    if (event.code === "Insert") {
      return setRebus(true);
    }
    // Check for change of direction
    if (
      (event.code === "ArrowRight" || event.code === "ArrowLeft") &&
      direction === "down"
    ) {
      newDirection = "across";
    } else if (
      (event.code === "ArrowDown" || event.code === "ArrowUp") &&
      direction === "across"
    ) {
      newDirection = "down";
    } else {
      let nextCell = searchForValidCell(
        row,
        col,
        direction,
        event.code,
        crossword.board
      );
      return setSelected(nextCell[0], nextCell[1], newDirection);
    }
    setSelected(row, col, newDirection);

    // console.log('should not see this')
    // updatePosition(increment, decrement)
  }

  const setSelected = (row, col, newDirection) => {
    // Toggle direction if clicking active sqaure
    let wordEnd = searchForBoundaryCell(row, col, newDirection, "INCREMENT");
    let wordBeg = searchForBoundaryCell(row, col, newDirection, "DECREMENT");
    setWordCoords([wordBeg, wordEnd]);
    setCurrentCoords([row, col]);
    setDirection(newDirection);
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
    setSelected(rowNum, colNum, newDirection);
  };

  let rows = Object.keys(crossword.board).map((row, rowNum) => {
    return (
      <tr className="row">
        {crossword.board[row].map((cell, colNum) => {
          let black = cell === "#BlackSquare#";
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
              answer={cell}
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
