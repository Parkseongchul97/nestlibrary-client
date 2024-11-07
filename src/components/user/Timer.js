import React, { useState, useEffect } from "react";

function CountdownTimer({ resend, secondsLeft, setSecondsLeft, isOpen }) {
  // 3분 (180초)에서 시작

  const [isActive, setIsActive] = useState(true); // 타이머가 작동 중인지 여부
  const [intervalId, setIntervalId] = useState(null); // setInterval ID를 저장하여 나중에 정지할 때 사용
  const [thisPage, setThisPage] = useState("");
  // 타이머 시작/정지 함수
  //   const toggleTimer = () => {
  //     if (isActive) {
  //       const id = setInterval(() => {
  //         setSecondsLeft((prevSeconds) => {
  //           if (prevSeconds > 0) {
  //             console.log(prevSeconds);
  //             return prevSeconds - 1; // 1초씩 감소
  //           } else {
  //             return 0;
  //           }
  //         });
  //       }, 1000);
  //       setIntervalId(id);
  //     }
  //   };
  //   const resetTimer = () => {
  //     clearInterval(intervalId);
  //     setSecondsLeft(30); // 3분으로 리셋
  //   };

  //   useEffect(() => {
  //     toggleTimer();
  //   }, []);
  // const formatTime = (time) => {
  //     const minutes = Math.floor(time / 60);
  //     const seconds = time % 60;
  //     return `${minutes.toString().padStart(2, "0")}:${seconds
  //       .toString()
  //       .padStart(2, "0")}`;
  //   };
  useEffect(() => {
    if (secondsLeft !== 0) {
      const id = setInterval(() => {
        setSecondsLeft((count) => count - 1);
      }, 1000);
      if (secondsLeft === 0) {
        clearInterval(id);
      }
      return () => clearInterval(id);
    }
  }, [secondsLeft]);
  //   useEffect(() => {
  //     console.log(isOpen);
  //     if (!isOpen) {
  //       resetTimer();
  //     }
  //   }, [isOpen]);

  //   useEffect(() => {
  //     if (resend > 1) {
  //       resetTimer();
  //       toggleTimer();
  //     }
  //   }, [resend]);

  // 남은 시간을 '분:초' 형식으로 변환
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div>
      <p>남은 시간: {formatTime(secondsLeft)}</p>
    </div>
  );
}

export default CountdownTimer;
