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
            "http://192.168.10.51:8083/channel/" +
            channelCode +
            "/" +
            Channel?.channelImgUrl
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
