import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { userPost } from "../api/post";
const UserPage = () => {
  const { userNickname } = useParams();

  const [post, setPost] = useState([]);

  const getPost = async () => {
    const response = await userPost(userNickname);
    setPost(response.data);
  };

  useEffect(() => {
    getPost();
  }, [userNickname]);

  return (
    <>
      <div>최근 활동 내역 </div>
      {post.map((post) => (
        <div>{post.postTitle} </div>
      ))}
    </>
  );
};
export default UserPage;
