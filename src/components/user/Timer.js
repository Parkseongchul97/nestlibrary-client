import React, { useEffect } from "react";
import "../../assets/timer.scss";

const Timer = ({ count, setCount }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (count > 0) {
      const id = setInterval(() => {
        setCount((count) => count - 1);
      }, 1000);

      if (count === 0) {
        clearInterval(id);
      }
      return () => clearInterval(id);
    }
  }, [count]);

  return (
    <div className="timer-container">
      <span className="timer-text">{count > 0 ? formatTime(count) : null}</span>
    </div>
  );
};

export default Timer;
