import UserMenu from "../user/UserMenu";
import { useAuth } from "../../contexts/AuthContext";
import MessagesDetail from "../messages/MessagesDetail";
import { useEffect, useState } from "react";
import { IoMailOpenOutline, IoMailOutline } from "react-icons/io5";
import TimeFormat from "../TimeFormat";
import { useQueryClient } from "@tanstack/react-query";
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
  openDetail,
  setIsOpenMessage,
  setToUser,
}) => {
  const { user } = useAuth();
  const [isCheck, setIsCheck] = useState(isChecked);
  const queryClient = useQueryClient();
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
  const resetMessage = () => {
    queryClient.invalidateQueries({ queryKey: ["messageList"] });
  };
  useEffect(() => {
    setIsCheck(isChecked);
  }, [isChecked]);

  return (
    <>
      <div
        className={
          isOpen === message.messagesCode
            ? "selected-message-main"
            : "message-main"
        }
        key={message.messagesCode}
      >
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
              resetMessage();
            }}
            className="message-link"
          >
            <div className="message-center">{message.messagesTitle}</div>
          </div>
        </div>

        <div className="message-right">
          {user.userEmail === message.messagesFromUser.userEmail ? (
            <div className="message-user">
              <UserMenu
                user={message.messagesToUser}
                isOpenUser={isOpenUser === message.messagesCode}
                userMenuToggle={() => userMenuToggle(message.messagesCode)}
              />
            </div>
          ) : (
            <div className="message-user">
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
          viewType={viewType}
          setIsOpenMessage={setIsOpenMessage}
          setToUser={setToUser}
        />
      )}
    </>
  );
};
export default MessageList;
