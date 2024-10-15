import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CommentComponent from "../components/CommentComponent";
import "../assets/postDetail.scss";

// 리액트 쿼리(React Query)
// 서버에 데이터에 특화되어 비동기 작업을 훨씬 쉽게 처리할 수 있는 라이브러리
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment as addCommentAPI, viewComment } from "../api/comment";
import { viewPost } from "../api/post";

const PostDetail = () => {
  const { postCode } = useParams();
  const { user } = useAuth();

  const [isComment, setIsComment] = useState(false);
  const [newComment, setNewComment] = useState({
    commentContent: "",
    postCode: postCode,
    userEmail: user?.userEmail,
  });
  const [post, setPost] = useState(null);

  const queryClient = useQueryClient();
  // 댓글 목록
  const {
    data: commentList,
    isLoading,
    error,
  } = useQuery({
    // 데이터, 로딩중인지, 에러발생
    queryKey: ["comment", postCode],
    queryFn: () => viewComment(postCode),
    refetchInterval: 1000, // 해당 시간마다 데이터갱식하여 실시간 처럼 처리
  });

  // 댓글 추가
  const addmutation = useMutation({
    mutationFn: addCommentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment", postCode] });
    },
  });

  // 댓글추가
  const addComment = () => {
    addmutation.mutate(newComment); // 리액트쿼리
    setIsComment(false);
    setNewComment({ ...newComment, commnetText: "" });
  };
  const loadingPost = async () => {
    const response = await viewPost(postCode);
    setPost(response.data);
  };
  useEffect(() => {
    loadingPost();
  }, []);
  // 시점이 다를때마다 useEffect 추가

  // 데이터 로딩중일 때 처리
  if (isLoading) return <>로딩중...</>;

  // 에러 발생시 처리
  if (error) return <>에러발생...</>;

  return (
    <div className="post-detail">
      <h1 className="post-title">{post?.postTitle}</h1>
      <span>작성시각 :{post?.postCreatedAt} </span>
      <div>조회수 :{post?.postViews} </div>
      <div>작성자 :{post?.user?.userNickname} </div>

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post?.postContent }}
      />
      <div className="comment">
        <input
          className="comment-add"
          type="text"
          placeholder="댓글 추가.."
          value={newComment.commentContent}
          onClick={() => setIsComment(true)}
          onChange={(e) => {
            setNewComment({ ...newComment, commentContent: e.target.value });
          }}
        />
        {isComment && (
          <div className="comment-add-status">
            <button
              className="comment-submit"
              onClick={() => setIsComment(false)}
            >
              취소
            </button>
            <button className="comment-submit" onClick={addComment}>
              댓글 등록
            </button>
          </div>
        )}
        <div className="comment-list">
          {isLoading && Array.isArray(commentList.data) ? (
            <p>댓글이 없습니당</p>
          ) : (
            commentList.data.map((comment) => (
              <CommentComponent
                comment={comment}
                postCode={postCode}
                key={comment.commentCode}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default PostDetail;
