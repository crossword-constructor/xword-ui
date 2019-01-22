import React, { useState } from 'react';

import './App.css';
import crossword from './crossword.json'
const App = () => {

  let rows = Object.keys(crossword.board).map(row => {
    return (
      <tr className='row'>
        {crossword.board[row].map(cell => {
          let black = cell === '#BlackSquare#'

          return <td className={black ? 'black' : 'cell'}>{black ? null : cell}</td>
        })}
      </tr>
    )
  })

  return (
    <div className="page">
      <table className="board">
        {rows}
      </table>
      <div className="clues">
        <div className="acrossClues">
          {crossword.clues.map(clue => {
            return <div className="clue">{clue.clue}</div>
          })}
        </div>
        <div className="downClues"></div>
      </div>
    </div>
  );
}

export default App;
