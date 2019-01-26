import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import './App.css';
import crossword from './crossword.json';
const App = () => {

  const [ direction, setDirection ] = useState('across');
  const [ wordCoords, setWordCoords ] = useState([0, 0]);
  const [ currentCoords, setCurrentCoords ] = useState([0,0]);

  // USE EFFECT IF FIRST SQUARE IS BLACK CHANGE CURRENT COORDS
  // USE EFFECT SETUP KEYPRESS LISTENER
  // useEffect(() => {

  // }, [currentCoords, direction])

  const setSelected = (row, col) => {
    // Toggle direction if clicking active sqaure
    let newDirection = direction
    if (row === currentCoords[0] && col === currentCoords[1]) {
      newDirection = direction === 'across' ? 'down' : 'across';
    }
    let wordEnd = searchForCell(row, col, newDirection, 'INCREMENT')
    let wordBeg = searchForCell(row, col, newDirection, 'DECREMENT')
    setWordCoords([wordBeg, wordEnd])
    setCurrentCoords([row, col])
    setDirection(newDirection)
  }

  // Search for end or beginnging of a word
  const searchForCell = (row, col, direction, incOrDec) => {
    let cell;
    let endCounter = (direction === 'across') ? col : row;
    let currentCell;
    while (!cell) {
      if (direction === 'across') {
        currentCell = crossword.board[row][endCounter];
      } else {
        try {
          currentCell = crossword.board[parseInt(endCounter)][col]
        } catch(err) {currentCell = undefined;}
      }
      if (!currentCell || currentCell === "#BlackSquare#") {
        cell = incOrDec === 'INCREMENT' ? endCounter - 1 : endCounter + 1;
        return cell;
      }
      if (incOrDec === 'INCREMENT') {
        endCounter++;
      } else {
        endCounter--;
      }
    }
  }

  let rows = Object.keys(crossword.board).map((row, rowNum) => {
    return (
      <tr className='row'>
        {crossword.board[row].map((cell, colNum) => {
          let black = cell === '#BlackSquare#'
          let highlighted = false;
          if (direction === 'across') {
            if ((colNum >= wordCoords[0] && colNum <= wordCoords[1]) && rowNum === currentCoords[0]) {
              highlighted = true;
            }
          } else {
            if ((rowNum >= wordCoords[0] && rowNum <= wordCoords[1]) && colNum === currentCoords[1]) {
              highlighted = true;
            }
          }
          return (black
            ? <td className='black'></td>
            : <Cell
                highlighted={highlighted}
                answer={cell}
                coords={[rowNum, colNum]}
                click={() => setSelected(rowNum, colNum)}
              />
          )
        })}
      </tr>
    )
  })
  console.log('render')
  return (
    <div className="page">
      <table>
      <tbody className="board">
        {rows}
      </tbody>
      </table>
      <div className="clues">
        <div className="acrossClues">
          {crossword.clues.filter(clue => clue.position.indexOf('A') > -1).map(clue => {
            return <div className="clue">{clue.position}</div>
          })}
        </div>
        <div className="downClues">
          {crossword.clues.filter(clue => clue.position.indexOf('D') > -1).map(clue => {
            return <div className="clue">{clue.position}</div>
          })}
        </div>
      </div>
    </div>
  );
}

// position = [row, col]
// incOrDec = increment or decrement


export default App;
