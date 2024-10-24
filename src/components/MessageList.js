import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useAuth } from "../contexts/AuthContext";
import MessagesDetail from "./MessagesDetail";
import { useEffect, useState } from "react";
import { IoMailOpenOutline, IoMailOutline } from "react-icons/io5";
import TimeFormat from "./TimeFormat";
const MessageList = ({
  message,
  setIsOpen,
  isOpen,
  isChecked,
  checkedList,
  setCheckedList,
  viewType,
}) => {
  const { user } = useAuth();
  const [isCheck, setIsCheck] = useState(isChecked);
  const openDetail = (code) => {
    if (isOpen === code) {
      setIsOpen(0);
    } else {
      setIsOpen(code);
    }
  };
  const [notRead, setNotRead] = useState(false);
  const listChange = (messagesCode) => {
    const list = [...checkedList, messagesCode];
    setCheckedList(list);
  };
  const checkboxInput = () => {
    if (!isCheck) {
      console.log(message.messagesCode + " 체크");
      listChange(message.messagesCode);
    } else {
      console.log(message.messagesCode + " 해제");
      const updatedList = [];
      for (const code of checkedList) {
        if (message.messagesCode !== code) {
          updatedList.push(code);
        }
      }
      setCheckedList(updatedList);
    }
  };
  useEffect(() => {
    setIsCheck(isChecked);
  }, [isChecked]);

  return (
    <div className="message-box">
      <div className="message-main" key={message.messagesCode}>
        <input
          checked={isCheck}
          value={message.messagesCode}
          type="checkbox"
          onChange={() => {
            setIsCheck(!isCheck);
            checkboxInput();
          }}
        />
        <div
          onClick={() => {
            openDetail(message.messagesCode);
            setNotRead(true);
          }}
          className="message-link"
        >
          {message.messagesTitle}
        </div>
        <div className="message-user">
          {/*내가 받은사람인지 보낸사람인지 구분 내가 보낸사람이면*/}
          {user.userEmail === message.messagesFromUser.userEmail ? (
            <>
              <div>받은사람</div>
              <UserMenu user={message.messagesToUser} />
            </>
          ) : (
            <>
              <div>보낸사람</div>
              <UserMenu user={message.messagesFromUser} />
            </>
          )}
          <TimeFormat
            time={message.messagesSentAt}
            className="message-time"
          ></TimeFormat>

          {viewType !== "open" ? (
            <div className="is-open">
              {message.messagesRead ? (
                <IoMailOpenOutline size={"2rem"} />
              ) : (
                <IoMailOutline size={"2rem"} />
              )}
            </div>
          ) : (
            <div className="is-open">
              {notRead ? (
                <IoMailOpenOutline size={"2rem"} />
              ) : (
                <IoMailOutline size={"2rem"} />
              )}
            </div>
          )}
        </div>
      </div>
      {isOpen === message.messagesCode && (
        <MessagesDetail
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          messagesCode={message?.messagesCode}
          key={message?.messagesCode}
        />
      )}
    </div>
  );
};
export default MessageList;
