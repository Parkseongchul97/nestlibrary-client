import { useEffect } from "react";
import { main } from "../api/channel";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { addSub, check, removeSub } from "../api/subscribe";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";

const ChannelDetail = () => {
  const openPage = () => {
    setPage(true);
  };
  const [page, setPage] = useState(false);
  const closeLogin = () => {
    setPage(false);
  };
  const { user } = useAuth();
  const { channelCode } = useParams();
  const [isSub, setIsSub] = useState("");
  const [Channel, setChannel] = useState({
    channelTag: [
      {
        channelTagName: "",
      },
    ],
  });

  const channelInfo = async () => {
    const result = await main(channelCode);

    setChannel(result.data);
  };

  useEffect(() => {
    channelInfo();
    if (localStorage.getItem("token") != null) subCheck();
  }, [channelCode]);

  console.log(isSub);
  console.log(localStorage.getItem("token"));

  const subCheck = async () => {
    const result = await check(channelCode);
    setIsSub(result.data);
  };

  const sub = async (data) => {
    if (localStorage.getItem("token") == null) {
      openPage();
      return;
    }
    await addSub(data);
    subCheck();
  };

  const remove = async () => {
    await removeSub(isSub?.managementCode);
    subCheck();
  };

  return (
    <>
      <div className="main-box">
        !!채널메인!!
        <p>{Channel?.channelName}</p>
        <img
          src={
            Channel?.channelImgUrl != null
              ? "http://192.168.10.51:8083/channel/" +
                channelCode +
                "/" +
                Channel?.channelImgUrl
              : "http://192.168.10.51:8083/%EA%B8%B0%EB%B3%B8%EB%8C%80%EB%AC%B8.jpg"
          }
        />
        {Channel?.channelTag.map((channelTag) => (
          <li>{channelTag.channelTagName}</li>
        ))}
      </div>

      {isSub === "" ? (
        <button
          onClick={() =>
            sub({
              userEmail: user.userEmail,
              channelCode: channelCode,
            })
          }
        >
          구독
        </button>
      ) : isSub?.managementUserStatus === "host" ? (
        <button>내 채널</button>
      ) : isSub?.managementUserStatus === "admin" ? (
        <button>관리자</button>
      ) : isSub?.managementUserStatus === "sub" ? (
        <button onClick={remove}>구독취소</button>
      ) : null}

      <p>구독자 수 </p>

      {page && <Login onClose={closeLogin} />}
    </>
  );
};
export default ChannelDetail;
