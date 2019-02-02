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

  function keyListener(event) {
    let [row, col] = currentCoords;
    if (event.code === "Insert") {
      return setRebus(true);
    }
    console.log(row, col);
    let { nextCoords, newDirection } = getNextCoords(
      event.code,
      row,
      col,
      direction,
      crossword.board
    );
    console.log(nextCoords, newDirection);
    setSelected(nextCoords[0], nextCoords[1], newDirection);

    // console.log('should not see this')
    // updatePosition(increment, decrement)
  }

  const setSelected = (row, col, newDirection) => {
    // Toggle direction if clicking active sqaure
    if (row === currentCoords[0] && col === currentCoords[1]) {
      newDirection = newDirection === "across" ? "down" : "across";
    }
    let wordEnd = searchForBoundaryCell(row, col, newDirection, "INCREMENT");
    let wordBeg = searchForBoundaryCell(row, col, newDirection, "DECREMENT");
    setWordCoords([wordBeg, wordEnd]);
    setCurrentCoords([row, col]);
    setDirection(newDirection);
  };

  const getNextCoords = (key, row, col, direction, board) => {
    console.log(row, col);
    let newDirection;
    if (direction === "across") {
      if (key === "ArrowLeft") {
        col -= 1;
      } else if (key === "ArrowRight") {
        let [newRow, newCol] = searchForValidCell(
          row,
          col,
          direction,
          "INCREMENT",
          board
        );
        return { nextCoords: [newRow, newCol], newDirection: direction };
      } else if (key === "ArrowUp" || key === "ArrowDown") {
        return { nextCoords: [row, col], newDirection: "down" };
      }
    } else if (direction === "down") {
      if (key === "ArrowUp") {
      } else if (key === "ArrowDown") {
      } else if (key === "ArrowLeft" || key === "ArrowRight") {
        return setDirection("across");
      }
    }
  };

  const searchForValidCell = (row, col, direction, incOrDec, board) => {
    let validCellFound;
    while (!validCellFound) {
      console.log(row, col);
      if (direction === "across") {
        if (incOrDec === "INCREMENT") {
          col += 1;
          if (!board[row][col]) {
            col = 0;
          }
          if (board[row][col] === "#BlackSquare#") {
            validCellFound = false;
          } else {
            validCellFound = true;
            return [row, col];
          }
        }
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
              click={() => setSelected(rowNum, colNum, direction)}
              onKeyDown={keyListener}
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
