import React, { useState, useEffect } from "react";

import "./App.css";
const Cell = ({ answer, number, guess, click, focus, highlighted }) => {
  let background = "#F6F6F6";
  if (focus) {
    background = "yellow";
  } else if (highlighted) {
    background = "#a0effb";
  }
  return (
    <td onMouseDown={click} className="cell">
      <div
        style={{
          background
        }}
        className="cellInput"
      >
        {guess}
      </div>
    </td>
  );
};

export default Cell;
