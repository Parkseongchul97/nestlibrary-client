import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { userPost, mostChannel } from "../api/post";
import { userPageInfo } from "../api/user.js";
import "../assets/userPage.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import RecentPost from "../components/post/RecentPost.js";
import { useAuth } from "../contexts/AuthContext.js";
import MessageWrite from "../components/messages/MessageWrite.js";
import Example from "../components/Chart.js";

const UserPage = () => {
  const { token, user: loginUser } = useAuth();
  const { userEmail } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState([]);
  const [channel, setChannel] = useState([]);
  const [user, setUser] = useState();
  const [isOpenMessage, setIsOpenMessage] = useState(false);
  const getPost = async () => {
    const response = await userPost(userEmail);
    setPost(response.data);
  };
  const getChannel = async () => {
    const response = await mostChannel(userEmail);
    console.log(response.data);
    setChannel(response.data);
  };
  const getUser = async () => {
    const response = await userPageInfo(userEmail);
    setUser(response.data);
    if (response.data === "") {
      navigate("/error");
    }
  };

  useEffect(() => {
    getPost();
    getChannel();
    getUser();
  }, [userEmail]);

  return (
    <>
      <div className="userPage-container">
        <div className="userPage-box">
          <div className="user-channel">
            <div className="userPage-userProfile">
              <div className="userPage-img-box">
                <img
                  className="user-img"
                  src={
                    user !== undefined && user?.userImgUrl !== null
                      ? "http://192.168.10.51:8083/user/" +
                        user?.userEmail +
                        "/" +
                        user?.userImgUrl
                      : "http://192.168.10.51:8083/e0680940917fba1b2350c6563c32ad0c.jpg"
                  }
                />
                {token && loginUser?.userEmail !== user?.userEmail && (
                  <div
                    className="user-page-message"
                    onClick={() => {
                      setIsOpenMessage(true);
                    }}
                  >
                    쪽지쓰기
                  </div>
                )}
              </div>
              <div className="user-text">
                <div className="user-text-main">
                  {user?.userNickname}의 채널 로그
                </div>
                <div className="user-message">한줄소개 : {user?.userInfo}</div>
                <div className="user-point">Point : {user?.userPoint}</div>
              </div>
            </div>
            <div className="userPage-channelList">
              <div className="userPage-channelList-info">
                자주 이용한 채널 목록
              </div>
              <div className="userPage-channel-item">
                <div className="userPage-channel-rank">NO.</div>
                <div className="userPage-channel-title">채널명</div>
                <div className="userPage-channel-post">작성글 수</div>
                <div className="userPage-channel-comment">댓글 수</div>
              </div>
              {channel.length > 0 ? (
                channel?.map((channel, index) => (
                  <div
                    className="userPage-channelDetail"
                    key={channel?.channelCode}
                  >
                    <div className="userPage-favorate-rank">{index + 1}</div>
                    <div className={"userPage-favorate-title-" + index}>
                      {" "}
                      <Link
                        to={"/channel/" + channel.channelCode}
                        key={channel?.channelCode}
                      >
                        {channel.channelName}
                      </Link>
                    </div>{" "}
                    <div className="userPage-favorate-post">
                      {" "}
                      {channel.postCount}
                    </div>
                    <div className="userPage-favorate-comment">
                      {channel.commentCount}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="userPage-favorate-null">
                    아직 활동한 채널이 없습니다{" "}
                  </div>
                </>
              )}
            </div>
          </div>
          {channel && (
            <div className="chart-grand-parent">
              <div className="chart-parent">
                <Example channel={channel} />
              </div>
            </div>
          )}

          <div className="userPage-post-list">
            <div className="userPage-title">최근 작성 게시물 </div>
            <div className="userPage-post-item">
              <div className="postList-channel-title">채널명</div>
              <div className="postList-tag">채널태그</div>
              <div className="postList-title">제목</div>
              <div className="postList-at">작성일</div>
              <div className="postList-view">조회수</div>
              <div className="postList-like">좋아요</div>
              <div className="postList-comment">댓글</div>
            </div>
            {post.length > 0 ? (
              post.map((post) => (
                <RecentPost post={post} key={post?.postCode} />
              ))
            ) : (
              <>
                <div className="userPage-post-null">
                  아직 작성한 글이 없습니다
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {isOpenMessage && (
        <MessageWrite
          isOpenMessage={isOpenMessage}
          setIsOpenMessage={setIsOpenMessage}
          toUser={{
            toUser: {
              email: user?.userEmail,
              nickname: user?.userNickname,
            },
          }}
        />
      )}
    </>
  );
};
export default UserPage;
