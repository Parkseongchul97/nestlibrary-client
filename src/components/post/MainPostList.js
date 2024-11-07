import { Link } from "react-router-dom";
import "../../assets/mainPostList.scss";
import UserMenu from "../user/UserMenu";
const MainPostList = ({ channelTagCode, post, page }) => {
  if (!post) {
    return null;
  }
  return (
    <>
      <div className="channel-main-post">
        <div className="channel-main-left">
          <div className="channel-tag-box">
            <Link
              className="channel-main-tag"
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
            className="main-post-link"
            to={
              channelTagCode !== undefined
                ? `/channel/${post?.channelCode}/${channelTagCode}/post/${post?.postCode}?page=${page}`
                : `/channel/${post?.channelCode}/post/${post?.postCode}?page=${page}`
            }
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="post-text" title={post?.postTitle}>
              {post?.postTitle}
            </span>
          </Link>
        </div>
        <div className="channel-main-right">
          <UserMenu
            user={post?.user}
            noneImg={true}
            isOpenUser={false}
            channelCode={post?.channelCode}
            time={post?.postCreatedAt}
          />
        </div>
      </div>
    </>
  );
};
export default MainPostList;
