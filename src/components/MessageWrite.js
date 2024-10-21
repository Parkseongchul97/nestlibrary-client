import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { findUser as byNickname } from "../api/message";
import UserMenu from "./UserMenu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import "../assets/messageWrite.scss";
const MessageWrite = () => {
  const { user } = useAuth(); // 발신자(로그인유저)
  const [message, setMessage] = useState({
    messageTitle: "",
    messagesContent: "",
    messagesRead: false,
    messagesFromUser: user.userEmail,
    messagesToUser: "",
  });
  const [toUser, setToUser] = useState(null); // 수신자 정보
  const [toNickname, setToNickname] = useState(""); // 수신자 찾기
  const queryClient = useQueryClient();
  const [submit, setSubmit] = useState(false);

  //   const fetchUser = debounce((nickname) => {
  //     return byNickname(nickname);
  //   }, 300); // 300ms 지연

  const {
    data: findUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["findUser", toNickname],
    // queryFn: () => byNickname(toNickname),
    queryFn: () => byNickname(toNickname),
    enabled: toNickname.length > 1,
  });
  const findSubmit = () => {};
  if (isLoading) return <></>;
  if (error) return <></>;
  return (
    <div className="write-box">
      <input
        placeholder="받는사람"
        type="text"
        value={toNickname}
        onChange={(e) => {
          setToNickname(e.target.value);
        }}
      />
      <button onClick={findSubmit}>찾기</button>

      {findUser !== undefined &&
        findUser.data.map((targetUser) => (
          <UserMenu user={targetUser} key={targetUser.userEmail} />
        ))}

      <input
        placeholder="제목을 입력하세요"
        type="text"
        value={message.messageTitle}
        onChange={(e) =>
          setMessage({ ...message, messageTitle: e.target.value })
        }
      />
      <textarea
        placeholder="내용을 입력하세요"
        value={message?.messagesContent}
        onChange={(e) =>
          setMessage({ ...message, messagesContent: e.target.value })
        }
      />
    </div>
  );
};
export default MessageWrite;
