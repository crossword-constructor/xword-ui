import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import crossword from "./crossword.json";
import {
  buildPlayableBoard,
  searchForBoundaryCell,
  searchForValidCell
} from "./boardUtils";
import "./App.css";

// Converts the object structure of board to store guesses next to answers

const App = () => {
  const [direction, setDirection] = useState("across");
  const [wordCoords, setWordCoords] = useState([0, 0]);
  const [currentCoords, setCurrentCoords] = useState([0, 0]);
  const [rebusPosition, setRebus] = useState(null);
  const [board, updateBoard] = useState([]);
  const [showAnswers, toggleAnswers] = useState(false);

  useEffect(() => {
    let board = buildPlayableBoard(crossword.board);
    updateBoard(board);
  }, []);

  useEffect(() => {
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
    if (code === "Insert") {
      return setRebus(true);
      // Check for change of direction
    } else if (/^[a-z0-9._]+$/i.test(event.key) && event.key.length === 1) {
      // INSERT GUESS
      let newBoard = { ...board };
      newBoard[row][col].guess = event.key;
      updateBoard(newBoard);
      // After inserting a letter move to the next position by making this key listener think the arrow key was pressed
      if (direction === "down") code = "ArrowDown";
      else code = "ArrowRight"; // @TODO DOn't move if we've reached a black square or the end of the board also we need to skip letters if they're already therr
    } else if (code === "Backspace") {
      if (/^[a-z0-9._]+$/i.test(crossword.board[row][col].guess)) {
        let newBoard = { ...board };
        newBoard[row][col].guess = "";
        updateBoard(newBoard);
      }
      if (direction === "down") code = "ArrowUp";
      else code = "ArrowLeft";
    } else if (code === "Space") {
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
        // settings
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
    let wordEnd = searchForBoundaryCell(
      row,
      col,
      newDirection,
      "INCREMENT",
      crossword.board
    );
    let wordBeg = searchForBoundaryCell(
      row,
      col,
      newDirection,
      "DECREMENT",
      crossword.board
    );
    return { wordBeg, wordEnd };
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
              showAnswer={showAnswers}
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
      <button onClick={() => toggleAnswers(!showAnswers)} className="reveal">
        {showAnswers ? "Hide Answers" : "Reveal Answers"}
      </button>
    </div>
  );
};

// position = [row, col]
// incOrDec = increment or decrement

export default App;
