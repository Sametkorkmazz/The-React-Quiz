import { useEffect, useState } from "react";
import { Action } from "../App";

export default function Timer({ totalTime, dispatch }) {
  const [timer, setTimer] = useState(totalTime);
  useEffect(() => {
    const id = setInterval(() => setTimer(prev => prev - 1),
      1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      dispatch({ type: Action.FINISH });
    }
  }, [timer, dispatch]);

  return (
    <span className={"timer"}>
      {new Date(timer * 1000).toISOString().substring(14, 19)}
    </span>
  );
}