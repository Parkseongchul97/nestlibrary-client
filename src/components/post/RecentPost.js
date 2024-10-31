import { getPageNum } from "../../api/post";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TimeFormat from "../TimeFormat";

const RecentPost = ({ post }) => {
  const [page, setPage] = useState(1);

  const pages = async () => {
    const response = await getPageNum(post?.postCode);
    setPage(response.data);
  };

  useEffect(() => {
    pages();
  }, []);

  return (
    <>
      <div className="RecentPost-post">
        <Link to={"/channel/" + post?.channelCode}>
          {" "}
          <div className="RecentPost-channel-name">
            <span className="RecentPost-channel-name-text">
              {post?.channelName}
            </span>
          </div>{" "}
        </Link>
        <Link
          to={
            "/channel/" +
            post?.channelCode +
            "/" +
            post?.channelTag?.channelTagCode
          }
        >
          <div className="RecentPost-tag">
            {post?.bestPoint > 50 && "🔥"}
            {post?.channelTag?.channelTagName}
          </div>
        </Link>

        <Link
          className="post-link"
          to={`/channel/${post?.channelCode}/${post.channelTag.channelTagCode}/post/${post?.postCode}?page=${page}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="RecentPost-text">{post?.postTitle}</div>
        </Link>

        <div className="RecentPost-at">
          <TimeFormat time={post?.postCreatedAt} />
        </div>
        <div className="RecentPost-view">
          <span className="comment-count">[{post?.postViews}]</span>
        </div>
        <div className="RecentPost-like">
          <span className="comment-count">[{post?.likeCount}]</span>
        </div>
        <div className="RecentPost-comment">
          <span className="comment-count">[{post?.commentCount}]</span>
        </div>
      </div>
    </>
  );
};

export default RecentPost;
