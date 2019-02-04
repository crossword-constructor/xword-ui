import React, { useState, useEffect } from "react";

import "./App.css";
const Clock = ({ playing }) => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    let newTime = time;
    setInterval(() => {
      setTime((newTime += 1));
    }, 1000);
  }, []);

  useEffect(() => {
    console.log("PLAYING: ", playing);
  }, playing);

  return;
  <div style={{ color: "red", fontSize: 200 }}>{time}</div>;
};

export default Clock;
