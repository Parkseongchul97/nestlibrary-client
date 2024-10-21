import { Link } from "react-router-dom";
import "../assets/messages.scss";
const Messages = () => {
  return (
    <div className="messages-box">
      <div className="messages-header">
        <div>발신 쪽지함</div>
        <div>수신 쪽지함</div>
        <Link to="/message/write">쪽지 쓰기</Link>
      </div>
      <div className="message-main">
        {/*메세지 컴포넌트 출력*/}
        <div>대충 메시지 제목 + 발신자 + 시간</div>
        <div>대충 메시지 제목 + 발신자</div>
        <div>대충 메시지 제목 + 발신자</div>
        <div>대충 메시지 제목 + 발신자</div>
        <div>대충 메시지 제목 + 발신자</div>
      </div>
    </div>
  );
};
export default Messages;
