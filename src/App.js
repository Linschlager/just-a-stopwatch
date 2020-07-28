import React, { useState, useEffect, memo } from "react";
import "./styles.css";

const padding = num => (num < 10 ? `0${num}` : num);

const Letter = memo(({ digit, children, active }) => {
  return (
    <span
      className={`${digit} ${children > 0 ? "gt0" : "eq0"} ${
        active ? "active" : "inactive"
      }`}
    >
      {children}
    </span>
  );
});
const Time = memo(({ hours, minutes, seconds }) => {
  return (
    <h1>
      <Letter digit="h" active={hours > 0}>
        {padding(hours)}
      </Letter>

      <Letter digit="m" active={minutes > 0 || hours > 0}>
        {padding(minutes)}
      </Letter>

      <Letter digit="s" active={seconds > 0 || minutes > 0 || hours > 0}>
        {padding(seconds)}
      </Letter>
    </h1>
  );
});
const Actions = memo(({ onPause, onReset, isPaused }) => {
  return (
    <div className="time-actions">
      <button className="time-action-button" onClick={onPause}>
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button className="time-action-button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
});

export default function App() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [paused, setPaused] = useState(false);

  // Interval
  useEffect(() => {
    const tick = () => {
      setSeconds(pr => pr + 1);
    };
    if (!paused) {
      const interval = setInterval(tick, 1000);
      console.log(`Registered timer on interval id=${interval}`);
      return () => clearInterval(interval);
    }
  }, [paused]);

  // Update document title
  useEffect(() => {
    window.document.title = [hours, minutes, seconds].map(padding).join(":");
  }, [hours, minutes, seconds]);
  // Seconds -> Minutes
  useEffect(() => {
    if (seconds >= 60) {
      setSeconds(0);
      setMinutes(pr => pr + 1);
    }
  }, [seconds]);
  // Minutes -> Hours
  useEffect(() => {
    if (minutes >= 60) {
      setMinutes(0);
      setHours(pr => pr + 1);
    }
  }, [minutes]);

  const handleReset = () => {
    setSeconds(0);
    setMinutes(0);
    setHours(0);
  };

  const togglePause = () => {
    setPaused(pr => !pr);
  };

  return (
    <div className="timer">
      <Time hours={hours} minutes={minutes} seconds={seconds} />
      <Actions onPause={togglePause} onReset={handleReset} isPaused={paused} />
    </div>
  );
}
