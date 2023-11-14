import { useState, useRef, useEffect } from "react";

function useTimer(): [
  string,
  () => void,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const Ref = useRef<any>(null);
  const [timer, setTimer] = useState("05:00");
  const [start, setStart] = useState(false);

  const getTimeRemaining = (e: string) => {
    const total = Date.parse(e) - Date.parse(new Date().toString());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total,
      minutes,
      seconds,
    };
  };

  const startTimer = (e: any) => {
    let { total, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  const clearTimer = (e: any) => {
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    deadline.setMinutes(deadline.getMinutes() + 5);
    return deadline;
  };
  const resetTimer = () => {
    clearInterval(Ref.current);
    setTimer("05:00");
    clearTimer(getDeadTime());
  };

  useEffect(() => {
    if (start) {
      clearTimer(getDeadTime());
    }
  }, [start]);

  return [timer, resetTimer, setStart];
}

export default useTimer;
