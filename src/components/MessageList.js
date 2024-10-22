import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useAuth } from "../contexts/AuthContext";
import MessagesDetail from "./MessagesDetail";
import { useState } from "react";
import "../assets/messageList.scss";

const MessageList = ({ message, setIsOpen, isOpen }) => {
  const { user } = useAuth();
  const openDetail = (code) => {
    if (isOpen === code) {
      setIsOpen(0);
    } else {
      setIsOpen(code);
    }
  };

  return (
    <div className="message-box">
      <div className="message-main" key={message.messagesCode}>
        <div
          onClick={() => openDetail(message.messagesCode)}
          className="message-link"
        >
          {message.messagesTitle}
        </div>
        <div className="message-user">
          {/*내가 받은사람인지 보낸사람인지 구분 내가 보낸사람이면*/}
          {user.userEmail === message.messagesFromUser.userEmail ? (
            <>
              <div>받은사람 : </div>
              <UserMenu
                user={message.messagesToUser}
                time={message.messagesSentAt}
              />
            </>
          ) : (
            <>
              <div>보낸사람 : </div>
              <UserMenu
                user={message.messagesFromUser}
                time={message.messagesSentAt}
              />
            </>
          )}
        </div>
        <div>열람 여부 : {message.messagesRead ? "읽씹" : "안읽씹"}</div>
      </div>
      {isOpen === message.messagesCode && (
        <MessagesDetail
          isOpen={isOpen}
          setIsOpen={() => setIsOpen(0)}
          messagesCode={message?.messagesCode}
          key={message?.messagesCode}
        />
      )}
    </div>
  );
};
export default MessageList;
