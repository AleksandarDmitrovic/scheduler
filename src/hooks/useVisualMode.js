import { useState } from "react";

const useVisualMode = function (initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = function (newMode, replace = false) {
    setMode(() => newMode);

    const newHistory = [...history]

    if (replace) {
      newHistory.pop()
    }

    newHistory.push(newMode)
    setHistory(newHistory)

  };
  const back = function () {
    if (history.length === 1) {
      return
    }
    history.pop()

    setMode(history.slice(-1)[0])

    setHistory([...history])
  }

  return {
    mode,
    transition,
    back
  };
}

export default useVisualMode;