import { useEffect, useState } from "react";
import { getPageNum } from "../../api/post";
const PostManagement = ({
  post,
  channelCode,
  setCheck,
  check,
  addList,
  checkArray,
}) => {
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
          value={post?.postCode} //
          onClick={(e) => addList(e.target.value)}
          checked={checkArray.includes(Number(post?.postCode))}
        />
      </td>

      <td>{post?.user.userNickname}</td>
      <td>{post?.user.userEmail}</td>
      <td>{post?.channelTag.channelTagName}</td>

      <td>
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
        >
          {post.bestPoint >= 50 ? "🔥" : null}
          {post.postTitle}
        </a>
      </td>

      <td>{post.postCreatedAt}</td>
      <td>{post.postViews}</td>
      <td>{post.commentCount}</td>
    </tr>
  );
};
export default PostManagement;
