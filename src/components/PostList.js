import { allChannel } from "../api/channel";
import { useState, useEffect } from "react";

const PostList = () => {
  const [channelList, setChannelList] = useState([]);
  const chanList = async () => {
    const result = await allChannel();
    setChannelList(result.data);
    console.log(channelList);
  };
  useEffect(() => {
    chanList();
  }, [channelList.length]);

  return <></>;
};

export default PostList;
