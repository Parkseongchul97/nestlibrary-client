import "../assets/main.scss";
import { Link } from "react-router-dom";
import { allChannel } from "../api/channel";
import { useEffect, useState } from "react";
import PostListComponent from "../components/PostListComponent";

const Main = () => {
  // 첫 호출때 null
  const [channelList, setChannelList] = useState([]);
  const chanList = async () => {
    const result = await allChannel();
    setChannelList(
      result.data.map((channel) => ({
        ...channel,
        allPost: channel.allPost || [],
      }))
    );
  };
  useEffect(() => {
    chanList();
  }, [channelList.length]);
  return (
    <div className="main-box">
      <div className="main">
        <div className="main-content">
          <div className="sub-title">OUR COMMUNITY</div>
          <ul className="channel-list">
            {channelList.map((channel) => (
              <li className="channel-box" key={channel?.channelCode}>
                <Link
                  to={"/channel/" + channel?.channelCode}
                  className="channel-name"
                >
                  {channel?.channelName} 채널
                </Link>

                {channel.allPost !== undefined &&
                channel.allPost.length !== 0 ? (
                  <div className="post-box">
                    {channel.allPost.map((post) => (
                      <PostListComponent post={post} key={post?.postCode} />
                    ))}
                  </div>
                ) : (
                  <div className="none-post-box">
                    <div>!</div>
                    <p>게시글이 없습니다.</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Main;
