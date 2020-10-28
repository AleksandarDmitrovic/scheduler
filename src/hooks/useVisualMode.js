import { useState } from "react";

const useVisualMode = function (initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = function (newMode) {
    setMode(() => newMode); //history.pop()
    history.push(newMode);

    setHistory(history)
    // console.log('history :', history);

  };
  const back = function () {
    console.log("HERE")
    history.pop()

    const historyLength = history.length;



    setMode(history[historyLength - 1])


    setHistory(history)

  }

  return {
    mode,
    transition,
    back
  };
}

export default useVisualMode;