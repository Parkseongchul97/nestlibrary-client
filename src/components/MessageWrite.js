import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { findUser as byNickname } from "../api/message";
import UserMenu from "./UserMenu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addMessage } from "../api/message";
import "../assets/messageWrite.scss";
const MessageWrite = () => {
  const { user } = useAuth(); // 발신자(로그인유저)
  const [message, setMessage] = useState({
    messagesTitle: "",
    messagesContent: "",
    messagesRead: false,
    messagesFromUser: user.userEmail, // 보내는 로그인유저
    messagesToUser: "", // 받을사람
  });
  const [toNickname, setToNickname] = useState(""); // 수신자 찾기
  const [inputNickname, setInputNickname] = useState(""); //입력한 닉네임
  const [viewNickname, setViewNickname] = useState("");
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: findUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["findUser", toNickname],
    queryFn: () => byNickname(toNickname),
    enabled: toNickname.length > 1,
  });
  const findSubmit = () => {
    setToNickname(inputNickname);
    setIsOpen(true);
  };
  const selectedUser = (targetUser) => {
    setMessage({ ...message, messagesToUser: targetUser?.userEmail });
    setViewNickname(targetUser?.userNickname);
  };
  const deleteToUser = () => {
    setToNickname("");
    setMessage({ ...message, messagesToUser: "" });
    setViewNickname("");
    setInputNickname("");
  };
  const submitMessage = async () => {
    const response = await addMessage(message);
    console.log(response.data);
    return response.data;
  };
  if (isLoading) return <></>;
  if (error) return <></>;
  return (
    <div className="write-box">
      <input
        placeholder="받는사람"
        type="text"
        value={inputNickname}
        onChange={(e) => {
          setInputNickname(e.target.value);
        }}
      />
      <button onClick={findSubmit}>찾기</button>

      {findUser !== undefined &&
        isOpen &&
        findUser.data.map(
          (targetUser) =>
            targetUser.userEmail !== user.userEmail && (
              <div>
                <UserMenu
                  user={targetUser}
                  key={targetUser.userEmail}
                  noneMenu={true}
                />
                <button
                  onClick={() => {
                    selectedUser(targetUser);
                    setIsOpen(false);
                  }}
                >
                  선택
                </button>
              </div>
            )
        )}
      <p>
        수신자 : {viewNickname} <button onClick={deleteToUser}>취소</button>
      </p>
      <input
        placeholder="제목을 입력하세요"
        type="text"
        value={message.messagesTitle}
        onChange={(e) =>
          setMessage({ ...message, messagesTitle: e.target.value })
        }
      />
      <textarea
        placeholder="내용을 입력하세요"
        value={message?.messagesContent}
        onChange={(e) =>
          setMessage({ ...message, messagesContent: e.target.value })
        }
      />
      <span>쪽지 발송에는 50pt가 소모됩니다</span>
      <button onClick={submitMessage}>발송</button>
    </div>
  );
};
export default MessageWrite;
