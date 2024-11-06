import { useEffect, useState } from "react";
import { oneMessage } from "../../api/message";
import { IoIosArrowBack } from "react-icons/io";
import "../../assets/messagesDetail.scss";
import UserMenu from "../user/UserMenu";
const MessagesDetail = ({
  setIsOpen,
  messagesCode,
  viewType,
  setIsOpenMessage,
  setToUser,
}) => {
  const [message, setMessage] = useState();
  const findMessage = async () => {
    const response = await oneMessage(messagesCode);
    setMessage(response.data);
  };
  useEffect(() => {
    findMessage();
  }, [messagesCode]);
  // 디테일 외부 클릭할떄? 닫히기
  return (
    <>
      <div className="message-detail-box">
        <div className="message-detail-header">
          <div className="message-button-type">
            <button className="close" onClick={setIsOpen}>
              <IoIosArrowBack />
            </button>
            <div className="message-type">
              {viewType === "from" ? "보낸쪽지" : "받은쪽지"}
            </div>
            <div className="header-balance"></div>
          </div>
          <div className="balance"></div>
        </div>
        <div className="message-detail-body">
          <div className="message-user-box">
            {viewType === "from" ? (
              <div className="message-from-user">
                <div>받은사람</div>
                <UserMenu user={message?.messagesToUser} />
              </div>
            ) : (
              <div className="message-to-user">
                <div>보낸사람</div>
                <UserMenu user={message?.messagesFromUser} />
              </div>
            )}
          </div>
          <div className="message-detail-content">
            {message?.messagesContent}
          </div>
          {viewType === "from" ? (
            <div
              className="message-resend"
              onClick={() => {
                setIsOpenMessage(true);
                setIsOpen(0);
                setToUser({
                  email: message?.messagesToUser.userEmail,
                  nickname: message?.messagesToUser.userNickname,
                });
              }}
            >
              또 보내기
            </div>
          ) : (
            <div
              className="message-resend"
              onClick={() => {
                setIsOpenMessage(true);
                setIsOpen(0);
                setToUser({
                  email: message?.messagesFromUser.userEmail,
                  nickname: message?.messagesFromUser.userNickname,
                });
              }}
            >
              답장하기
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default MessagesDetail;
