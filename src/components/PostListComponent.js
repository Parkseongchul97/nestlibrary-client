import { Link } from "react-router-dom";
import TimeFormat from "./TimeFormat";
import "../assets/postList.scss";
const PostListComponent = ({ post }) => {
  if (!post) {
    return null;
  }
  return (
    <>
      <div className="channel-post">
        <Link
          className="channel-tag"
          to={
            "/channel/" +
            post?.channelCode +
            "/" +
            post?.channelTag?.channelTagCode
          }
        >
          {post?.channelTag?.channelTagName}
        </Link>
        <Link className="post-link" to={"/post/" + post?.postCode}>
          <div className="post-start">
            <span className="post-ather">{post?.user.userNickname}</span>
            <span className="post-text">{post?.postTitle}</span>
          </div>
          <div className="post-end">
            <span className="comment-count">[{post?.commentCount}]</span>
            <TimeFormat time={post?.postCreatedAt} />
          </div>
        </Link>
      </div>
    </>
  );
};
export default PostListComponent;
