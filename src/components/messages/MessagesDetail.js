import { useEffect, useState } from "react";
import { oneMessage } from "../../api/message";
import { IoIosArrowBack } from "react-icons/io";
import "../../assets/messagesDetail.scss";
import UserMenu from "../user/UserMenu";
const MessagesDetail = ({ setIsOpen, messagesCode }) => {
  const [message, setMessage] = useState();
  const findMessage = async () => {
    const response = await oneMessage(messagesCode);
    setMessage(response.data);
  };
  useEffect(() => {
    findMessage();
  }, [messagesCode]);
  return (
    <>
      <div className="message-detail-box">
        <div className="message-detail-header">
          <button className="close" onClick={setIsOpen}>
            <IoIosArrowBack />
          </button>
          <h3>{message?.messagesTitle}</h3>
          <div className="balance"></div>
        </div>
        <div className="message-detail-body">
          발신 :<UserMenu user={message?.messagesToUser} />
          수신 :<UserMenu user={message?.messagesFromUser} />
          내용 :{message?.messagesContent}
        </div>
      </div>
    </>
  );
};
export default MessagesDetail;
