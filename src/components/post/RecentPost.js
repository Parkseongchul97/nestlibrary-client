import { getPageNum } from "../../api/post";
import { useState, useEffect } from "react";

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
    <div className="userPage-post">
      <div className="userPage-channel-name">{post.channelName}</div>
      <div className="userPage-channel-tag">
        {post.channelTag.channelTagName}
      </div>
      <div>
        <a
          href={
            "/channel/" +
            post?.channelCode +
            "/post/" +
            post?.postCode +
            "?page=" +
            page
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {post.postTitle}
        </a>{" "}
      </div>
      <div>{post.postCreatedAt}</div>
    </div>
  );
};

export default RecentPost;
