import { useState } from "react";

const useVisualMode = function (initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = function (newMode, replace = false) {
    setMode(() => newMode);

    if (!replace) {
      history.push(newMode);
      setHistory(history)
    }
  };
  const back = function () {
    if (history.length === 1) {
      return
    }
    history.pop()

    const backModeIndex = history.length - 1;

    setMode(history[backModeIndex])
    setHistory(history)
  }

  return {
    mode,
    transition,
    back
  };
}

export default useVisualMode;