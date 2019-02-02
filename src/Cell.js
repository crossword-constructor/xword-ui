import React, { useState, useEffect } from "react";

import "./App.css";
const Cell = ({
  answer,
  number,
  guess,
  showAnswer,
  click,
  focus,
  highlighted
}) => {
  let background = "#F6F6F6";
  if (focus) {
    background = "yellow";
  } else if (highlighted) {
    background = "#a0effb";
  }
  let color = "black";
  if (showAnswer) {
    if (answer.toLowerCase() !== guess.toLowerCase()) {
      color = "red";
    }
  }
  return (
    <td onMouseDown={click} className="cell">
      <div className="number">{number}</div>
      <div
        style={{
          background,
          color
        }}
        className="cellInput"
      >
        {showAnswer ? answer : guess}
      </div>
    </td>
  );
};

export default Cell;
