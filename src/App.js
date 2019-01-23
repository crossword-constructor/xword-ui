import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import './App.css';
import crossword from './crossword.json';
const App = () => {

  const [ direction, setDirection ] = useState('across');
  const [ wordEnd, setWordEnd ] = useState(0);
  const [ wordBeg, setWordBeg ] = useState(0);
  const [ currentCoords, setCurrentCoords ] = useState([0,0]);

  // USE EFFECT IF FIRST SQUARE IS BLACK CHANGE CURRENT COORDS
  // USE EFFECT SETUP KEYPRESS LISTENER
  useEffect(() => {
    let newWordEnd;
    let newWordBeg;
    let counter = (direction === 'across') ? currentCoords[1] : currentCoords[0];
    let currentSquare;
    if (direction === 'across') {
      while (!newWordEnd) {
        currentSquare = crossword.board[currentCoords[0]][counter]
        if (!currentSquare || currentSquare === "#BlackSquare#") {
          newWordEnd = counter - 1;
          console.log(wordEnd)
          setWordEnd(newWordEnd);
        }
        counter++
      }
    }
  }, [currentCoords, direction])


  let rows = Object.keys(crossword.board).map((row, rowNum) => {
    return (
      <tr className='row'>
        {crossword.board[row].map((cell, colNum) => {
          let black = cell === '#BlackSquare#'

          return (black
            ? <td className='black'></td>
            : <Cell
                highlighted={colNum === wordEnd && rowNum === currentCoords[0]}
                answer={cell}
                coords={[rowNum, colNum]}
                click={() => setCurrentCoords([rowNum, colNum])}
              />
          )
        })}
      </tr>
    )
  })
  console.log("CURRENT COORDS: ", currentCoords)
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

export default App;
