import React, { useState, useEffect } from "react";

function CountdownTimer() {
  // 3분 (180초)에서 시작
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [isActive, setIsActive] = useState(false); // 타이머가 작동 중인지 여부
  const [intervalId, setIntervalId] = useState(null); // setInterval ID를 저장하여 나중에 정지할 때 사용

  // 타이머 시작/정지 함수
  const toggleTimer = () => {
    if (isActive) {
      clearInterval(intervalId); // 타이머 중지
      setIsActive(false);
    } else {
      const id = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1; // 1초씩 감소
          } else {
            clearInterval(id); // 타이머 종료
            setIsActive(false); // 타이머 비활성화
            return 0;
          }
        });
      }, 1000);
    }
  };
  useEffect(() => {
    toggleTimer();
  }, []);

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
