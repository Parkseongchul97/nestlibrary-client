import { useEffect } from "react";
import { main } from "../api/channel";
import { useParams } from "react-router-dom";
import { useState } from "react";
const ChannelDetail = () => {
  const { channelCode } = useParams();
  const [Channel, setChannel] = useState();
  const channelInfo = async () => {
    const result = await main(channelCode);
    console.log(result.data);
    setChannel(result.data);
  };
  useEffect(() => {
    channelInfo();
  }, [channelCode]);
  return (
    <>
      <div className="main-box">
        !!채널메인!!
        <img
          src={
            "http://192.168.10.51:8083/channel/" +
            channelCode +
            "/" +
            Channel?.channelImgUrl
          }
        />
        <div>{Channel?.channelName}</div>
      </div>
    </>
  );
};
export default ChannelDetail;
