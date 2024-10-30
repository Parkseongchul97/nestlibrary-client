import UserMenu from "../user/UserMenu";
import { useAuth } from "../../contexts/AuthContext";
import MessagesDetail from "../messages/MessagesDetail";
import { useEffect, useState } from "react";
import { IoMailOpenOutline, IoMailOutline } from "react-icons/io5";
import TimeFormat from "../TimeFormat";
const MessageList = ({
  message,
  setIsOpen,
  isOpen,
  isChecked,
  checkedList,
  setCheckedList,
  viewType,
  isOpenUser,
  userMenuToggle,
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
      listChange(message.messagesCode);
    } else {
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
    <>
      <div className="message-main" key={message.messagesCode}>
        <div className="message-left">
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
            <div className="message-center">{message.messagesTitle}</div>
          </div>
        </div>

        <div className="message-right">
          {user.userEmail === message.messagesFromUser.userEmail ? (
            <div className="message-user">
              <div>수신자</div>
              <UserMenu
                user={message.messagesToUser}
                isOpenUser={isOpenUser === message.messagesCode}
                userMenuToggle={() => userMenuToggle(message.messagesCode)}
              />
            </div>
          ) : (
            <div className="message-user">
              <div>발신자</div>
              <UserMenu
                user={message.messagesFromUser}
                isOpenUser={isOpenUser === message.messagesCode}
                userMenuToggle={() => userMenuToggle(message.messagesCode)}
              />
            </div>
          )}
          <div className="maessage-right-right">
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
      </div>

      {isOpen === message.messagesCode && (
        <MessagesDetail
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          messagesCode={message?.messagesCode}
          key={message?.messagesCode}
        />
      )}
    </>
  );
};
export default MessageList;
