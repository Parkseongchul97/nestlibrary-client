import { Link } from "react-router-dom";
import "../assets/main.scss";
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
            "?channelTagCode=" +
            post?.channelTag?.channelTagCode
          }
        >
          {post?.channelTag?.channelTagName}
        </Link>
        <Link className="post-link" to={"/post/" + post?.postCode}>
          <span className="post-text">{post?.postTitle}</span>
          <div className="post-end">
            <span className="comment-count">[{post?.commentCount}]</span>
            <span className="time">{post?.postCreatedAt}</span>
          </div>
        </Link>
      </div>
    </>
  );
};
export default PostListComponent;
