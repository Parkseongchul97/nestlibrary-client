import "../assets/main.scss";
import { Link } from "react-router-dom";
import { allChannel } from "../api/channel";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PostListComponent from "../components/PostListComponent";
import { addSub } from "../api/subscribe";

const Main = () => {
  const { channelList, setPage, subCheck } = useOutletContext();

  console.log(subCheck);
  const scroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      setPage((page) => page + 1);
    }
  };

  // 랜더링 + 페이지 변화시마다 스크롤 이벤트 함수 생성 및 제거
  useEffect(() => {
    window.addEventListener("scroll", scroll);
    return () => {
      window.removeEventListener("scroll", scroll);
    };
  }, [setPage]);
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
                <button onClick={addSub}>구독 </button>
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
