import { useEffect } from "react";
import { main } from "../api/channel";
import { useParams } from "react-router-dom";
import { useState } from "react";
const ChannelDetail = () => {
  const { channelCode } = useParams();
  const [Channel, setChannel] = useState({
    channelTag: [
      {
        channelTagName: "",
      },
    ],
  });
  const channelInfo = async () => {
    const result = await main(channelCode);
    console.log(result.data);
    console.log(result.data.channelTag.channelTagName);
    setChannel(result.data);
  };
  useEffect(() => {
    channelInfo();
  }, [channelCode]);

  console.log("채널정보 " + Channel);
  return (
    <>
      <div className="main-box">
        !!채널메인!!
        <p>{Channel?.channelName}</p>
        {}
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
    </>
  );
};
export default ChannelDetail;
