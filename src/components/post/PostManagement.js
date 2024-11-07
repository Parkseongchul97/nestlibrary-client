import { useEffect, useState } from "react";
import { getPageNum } from "../../api/post";
import { Link } from "react-router-dom";
import { FaList } from "react-icons/fa";
const PostManagement = ({ post, channelCode, addList, checkArray }) => {
  const [page, setPage] = useState(1);

  const pages = async () => {
    const response = await getPageNum(post?.postCode);
    setPage(response.data);
  };

  useEffect(() => {
    pages();
  }, []);

  // [1,3,5,7]

  return (
    <tr key={post.postCode}>
      <td className="custom-input">
        <input
          type="checkbox"
          value={post?.postCode || ""} //
          onChange={(e) => addList(e.target.value)}
          checked={checkArray.includes(Number(post?.postCode))}
        />
      </td>

      <td className="custom-userNickname">
        <a
          href={"/user/" + post?.user.userEmail}
          target="_blank"
          rel="noopener noreferrer"
        >
          {post?.user.userNickname}
        </a>
      </td>

      <td>
        <a
          href={
            "/channel/" + channelCode + "/" + post?.channelTag.channelTagCode
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {post?.channelTag.channelTagName}
        </a>
      </td>

      <td className="custom-postTitle" data-fulltext={post.postTitle}>
        {" "}
        <a
          href={
            "/channel/" +
            channelCode +
            "/post/" +
            post?.postCode +
            "?page=" +
            page
          }
          target="_blank"
          rel="noopener noreferrer"
          title={post.postTitle}
        >
          {post.bestPoint >= 50 ? "🔥" : null}
          {post.postTitle}
        </a>
      </td>

      <td>{post.postCreatedAt.split("T")[0]}</td>
      <td title={post.postViews}>{post.postViews}</td>
      <td>{post.commentCount}</td>
    </tr>
  );
};
export default PostManagement;
