import React, { useState, useEffect } from 'react';

import './App.css';
const Cell = ({answer, number, click, focus, highlighted}) => {
  const [guess, setGuess] = useState(null)
  const [rebus, setRebus] = useState(false)
  let background = "#F6F6F6";
  if (focus) {
    background = "yellow"
  } else if (highlighted) {
    background = "#a0effb"
  }
  return (
    <td onMouseDown={click} className="cell">
      <div style={{
        background,
        width: "100%",
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        }} className='cellInput' onChange={(event) => {setGuess(event.target.value)}} type='text'>{answer}</div>
    </td>
  )
}

export default Cell;