import { Link } from "react-router-dom";
import TimeFormat from "./TimeFormat";
import { FaFaceGrinStars } from "react-icons/fa6";
import "../assets/postList.scss";
const PostListComponent = ({ post, channelCode }) => {
  if (!post) {
    return null;
  }
  return (
    <>
      <div className="channel-post">
        {post?.bestPoint > 50 && <FaFaceGrinStars size={28} />}
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
