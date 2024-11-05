import { useState, useEffect } from "react";
import { mySub, removeSub } from "../api/subscribe";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const SubChannelList = ({ onClose }) => {
  const { token } = useAuth();
  const [channelList, setChannelList] = useState([]);

  useEffect(() => {
    if (token !== null) {
      subChannel();
    }
  }, [token]);

  const subCancel = async (data) => {
    await removeSub(data);
    subChannel();
  };

  const subChannel = async () => {
    const response = await mySub();
    setChannelList(response.data);
  };

  return (
    <div className="sub-box">
      <ul className="sub-box-ul">
        {token !== null && channelList.length > 0 ? (
          channelList.map((channel) => (
            <li key={channel?.channelDTO.channelCode} className="sub-box-li">
              <span
                className="sub-box-channelName"
                onClick={() => onClose(false)}
              >
                <Link to={`/channel/${channel?.channelDTO.channelCode}`}>
                  {channel?.channelDTO.channelName}
                </Link>
              </span>
              <button
                className="sub-box-button"
                onClick={() => subCancel(channel?.management.managementCode)}
              >
                구독취소
              </button>
            </li>
          ))
        ) : (
          <div>구독중인 채널이 없습니다</div>
        )}
      </ul>
    </div>
  );
};

export default SubChannelList;
