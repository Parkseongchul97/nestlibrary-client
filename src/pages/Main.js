import "../assets/main.scss";
import { Link } from "react-router-dom";
import { allChannel } from "../api/channel";
import { useEffect, useState } from "react";

const Main = () => {
  const [channelList, setChannelList] = useState(null);
  const list = async () => {
    const result = await allChannel();
    setChannelList(result.data);
  };
  useEffect(() => {
    list();
  }, []);
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
                  원피스 채널
                </Link>
                {/*게시글 반복 5~10개 예정*/}
                {/*channel.posts.map((post) => ()*/}
                <div className="channel-post">
                  <Link
                    className="channel-tag"
                    to={"/channel/채널코드/채널태그코드"}
                  >
                    정보
                  </Link>
                  <Link
                    className="post-link"
                    to={"/channel/채널코드/채널태그코드/게시글코드"}
                  >
                    <span className="post-text">
                      아이콘은 활동 포인트를 통해 무료로 구매할 수 있으며,
                      탈퇴/강제탈퇴 시 모든 포인트 및 아이콘이 삭제됩니다.
                    </span>
                    <div className="post-end">
                      <span className="comment-count">[1]</span>
                      <span className="time">1분전</span>
                    </div>
                  </Link>
                </div>
                <div className="channel-post">
                  <Link
                    className="channel-tag"
                    to={"/channel/채널코드/채널태그코드"}
                  >
                    토론
                  </Link>
                  <Link
                    className="post-link"
                    to={"/channel/채널코드/채널태그코드/게시글코드"}
                  >
                    <span className="post-text">
                      에이스 vs 2년전 루피 누가이기냐?
                    </span>
                    <div className="post-end">
                      <span className="comment-count">[13]</span>
                      <span className="time">3분전</span>
                    </div>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Main;
