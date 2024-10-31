import { Link } from "react-router-dom";
import TimeFormat from "../TimeFormat";
import "../../assets/postList.scss";
import UserMenu from "../user/UserMenu";
const PostListComponent = ({
  channelTagCode,
  post,
  postCode,
  page,
  isAnnouncement,
}) => {
  if (!post) {
    return null;
  }

  return (
    <>
      <div
        className={
          isAnnouncement
            ? "announcement-post"
            : Number(postCode) === post?.postCode
            ? "selected-channel-post"
            : "channel-post"
        }
      >
        <div className="channel-tag-box">
          <Link
            className="channel-tag"
            to={
              "/channel/" +
              post?.channelCode +
              "/" +
              post?.channelTag?.channelTagCode
            }
          >
            {post?.channelTag?.channelTagName === "공지"
              ? "📢"
              : post?.bestPoint > 50 && "🔥"}
            {post?.channelTag?.channelTagName}
          </Link>
        </div>
        <Link
          className="post-link"
          to={
            channelTagCode !== undefined
              ? `/channel/${post?.channelCode}/${channelTagCode}/post/${post?.postCode}?page=${page}`
              : `/channel/${post?.channelCode}/post/${post?.postCode}?page=${page}`
          }
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="post-text">{post?.postTitle}</span>
        </Link>
        <div className="post-user">
          <UserMenu
            user={post?.user}
            noneImg={true}
            isOpenUser={false}
            channelCode={post?.channelCode}
          />
        </div>
        <div className="post-at">
          <TimeFormat time={post?.postCreatedAt} />
        </div>
        <div className="post-view">
          <span className="comment-count">[{post?.postViews}]</span>
        </div>
        <div className="post-like">
          <span className="comment-count">[{post?.likeCount}]</span>
        </div>
        <div className="post-comment">
          <span className="comment-count">[{post?.commentCount}]</span>
        </div>
      </div>
    </>
  );
};
export default PostListComponent;
