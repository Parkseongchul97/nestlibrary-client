import { Link } from "react-router-dom";
import TimeFormat from "../TimeFormat";
import { IoIosStar } from "react-icons/io";
import "../../assets/postList.scss";
import UserMenu from "../user/UserMenu";
const PostListComponent = ({ channelTagCode, post, postCode, page }) => {
  if (!post) {
    return null;
  }

  return (
    <>
      <div
        className={
          postCode == post?.postCode ? "selected-channel-post" : "channel-post"
        }
      >
        <Link
          className="channel-tag"
          to={
            "/channel/" +
            post?.channelCode +
            "/" +
            post?.channelTag?.channelTagCode
          }
        >
          {post?.bestPoint > 50 && "🔥"}
          {post?.channelTag?.channelTagName}
        </Link>

        <Link
          className="post-link"
          to={
            channelTagCode !== undefined
              ? `/channel/${post?.channelCode}/${channelTagCode}/post/${post?.postCode}?page=${page}`
              : `/channel/${post?.channelCode}/post/${post?.postCode}?page=${page}`
          }
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="post-start">
            <UserMenu
              user={post?.user}
              noneImg={true}
              isOpenUser={false}
              channelCode={post?.channelCode}
            />
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
