import React, { useState, useEffect } from 'react';

import './App.css';
const Cell = ({answer, number, click, focus, highlighted}) => {
  const [guess, setGuess] = useState(null)
  const [rebus, setRebus] = useState(false)

  return (
    <td onClick={click} className="cell">
      <input style={{background: highlighted ? "blue" : "#F5F5F5" }} focus={focus} className='cellInput' onChange={(event) => {setGuess(event.target.value)}} type='text' /></td>
  )
}

export default Cell;