import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { userPost, mostChannel } from "../api/post";
import "../assets/userPage.scss";
import { Link } from "react-router-dom";
import RecentPost from "../components/post/RecentPost.js";

const UserPage = () => {
  const { userNickname } = useParams();

  const [post, setPost] = useState([]);
  const [channel, setChannel] = useState([]);
  const getPost = async () => {
    const response = await userPost(userNickname);
    setPost(response.data);
  };
  const getChannel = async () => {
    const response = await mostChannel(userNickname);
    setChannel(response.data);
  };

  useEffect(() => {
    getPost();
    getChannel();
  }, [userNickname]);

  return (
    <>
      <div className="userPage-box">
        <div>자주 이용한 채널 목록</div>
        <div>
          {channel?.map((channel) => (
            <>
              <Link to={"/channel/" + channel.channelCode}>
                <div>{channel.channelName}</div>{" "}
              </Link>
              <div>작성글 수 : {channel.postCount}</div>
              <div>댓글 수 : {channel.commentCount}</div>
            </>
          ))}
        </div>
        <div className="userPage-title">최근 작성 게시물 </div>
        <div className="userPage-post-list">
          {post.map((post) => (
            <RecentPost post={post} />
          ))}
        </div>
      </div>
    </>
  );
};
export default UserPage;
