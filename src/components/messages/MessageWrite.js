import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { addMessage } from "../../api/message";
import "../../assets/messageWrite.scss";
import { Link } from "react-router-dom";
import FindUser from "../user/FindUser";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
const MessageWrite = ({ toUser, setIsOpenMessage, setViewType }) => {
  const { user } = useAuth(); // 발신자(로그인유저)
  const [message, setMessage] = useState({
    messagesTitle: "",
    messagesContent: "",
    messagesRead: false,
    messagesFromUser: user.userEmail, // 보내는 로그인유저
    messagesToUser: "", // 받을사람
  });

  const [isOpen, setIsOpen] = useState(false);
  const [inputNickname, setInputNickname] = useState(
    toUser !== undefined ? toUser.nickname : ""
  ); //입력한 닉네임(단순 입력값)
  const [toNickname, setToNickname] = useState(""); // 찾은 유저 닉네임
  const [viewNickname, setViewNickname] = useState(
    // 단순 화면단에 보일 닉네임
    toUser !== undefined ? toUser.nickname : ""
  );
  const [checked, setChecked] = useState(
    !!inputNickname && inputNickname.length > 1
  );
  const queryClient = useQueryClient();

  const submitMessage = async () => {
    const response = await addMessage(message);
    setIsOpenMessage(false);
    console.log(response);
    if (response.data === "") {
      alert("포인트가 부족합니다! (50포인트 필요)");
    }
    if (response.data) {
      alert("발송 완료!");
      queryClient.invalidateQueries({ queryKey: ["messageList"] });
      if (!toUser) {
        setViewType("from");
      }
    }
  };
  const findSubmit = () => {
    // 찾기버튼 누를시 넣어서 찾고 열어줌
    if (!inputNickname) alert("입력값이 없습니다");
    setToNickname(inputNickname);
    setIsOpen(true);
  };
  const selectedUser = (targetUser) => {
    // 선택 누르면 필요값 담고 선택한 사람 닉네임 노출
    setMessage({ ...message, messagesToUser: targetUser?.userEmail });
    setViewNickname(targetUser?.userNickname);
  };
  const deleteToUser = () => {
    setToNickname("");
    setMessage({ ...message, messagesToUser: "" });
    setViewNickname("");
    setInputNickname("");
  };

  useEffect(() => {
    setMessage(
      toUser !== undefined
        ? { ...message, messagesToUser: toUser.toUser.email }
        : { ...message }
    );

    if (toUser !== undefined) setViewNickname(toUser.toUser.nickname);
  }, [toUser]);

  return (
    <>
      <>
        <div className="write-box">
          <div className="write-header">
            <p className="side-btn" onClick={() => setIsOpenMessage(false)}>
              닫기
            </p>

            <input
              id="message-title"
              placeholder="제목을 입력하세요"
              type="text"
              value={message.messagesTitle}
              onChange={(e) =>
                setMessage({ ...message, messagesTitle: e.target.value })
              }
            />
            <Link className="side-btn" to="/messages">
              쪽지함
            </Link>
          </div>
          <div className="write-header-bottom">
            <FindUser
              toNickname={toNickname}
              inputNickname={inputNickname}
              setInputNickname={setInputNickname}
              findSubmit={findSubmit}
              viewNickname={viewNickname}
              deleteToUser={deleteToUser}
              selectedUser={selectedUser}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              setChecked={setChecked}
              checked={checked}
            />
          </div>
          <div className="message-content-box">
            <textarea
              id="message-content"
              placeholder="내용을 입력하세요"
              value={message?.messagesContent}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setMessage({ ...message, messagesContent: e.target.value });
                }
              }}
            />
          </div>
          <div className="write-bottom">
            <div>글자수 {message.messagesContent.length}/1000</div>
            <div className="submit-box">
              <span>쪽지 발송에는 50pt가 소모됩니다</span>
              <button onClick={submitMessage}>발송</button>
            </div>
          </div>
        </div>
      </>
    </>
  );
};
export default MessageWrite;
