const TimeFormat = ({ time }) => {
  // 값을 가져와서. 날짜를 아래꺼로 반환
  const getTime = () => {
    const now = new Date(); // 지금
    const myTime = new Date(time); // 파라미터로 받아온 시간을 데이트 타입으로 변환
    const diff = Math.floor((now - myTime) / 1000); // 지금으로부터 ~~ 반환

    const rtf = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });

    if (diff < 60) {
      // 초
      return rtf.format(-diff, "seconds");
    } else if (diff < 3600) {
      // 분
      return rtf.format(-Math.floor(diff / 60), "minutes");
    } else if (diff < 86400) {
      // 시
      return rtf.format(-Math.floor(diff / 3600), "hours");
    } else if (diff < 604800) {
      // 일
      return rtf.format(-Math.floor(diff / 86400), "days");
    }
  };
  return (
    <>
      <span className="time">{getTime()}</span>
    </>
  );
};
export default TimeFormat;
