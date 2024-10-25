import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CommentComponent from "../components/CommentComponent";
import "../assets/postDetail.scss";

// 리액트 쿼리(React Query)
// 서버에 데이터에 특화되어 비동기 작업을 훨씬 쉽게 처리할 수 있는 라이브러리
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment as addCommentAPI, viewComment } from "../api/comment";
import { viewPost } from "../api/post";
import { likeState as state, like, unLike } from "../api/postLike";
import TimeFormat from "../components/TimeFormat";
import Page from "../components/Page";
import { remove } from "../api/post";
import { checkGrade } from "../api/channel";
const PostDetail = () => {
  const [isOpenUser, setIsOpenUser] = useState(false);
  const { postCode } = useParams();
  const { user, token } = useAuth();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = query.get("page") || 1;
  const [newComment, setNewComment] = useState({
    commentContent: "",
    postCode: postCode,
    userEmail: user?.userEmail,
  });
  const [post, setPost] = useState(null);
  const [role, setRole] = useState("");

  const queryClient = useQueryClient();

  const userMenuToggle = (commentCode) => {
    if (isOpenUser === commentCode) {
      setIsOpenUser(null);
    } else {
      setIsOpenUser(commentCode);
    }
  };
  // 댓글 목록
  const {
    data: commentList,
    isLoading,
    error,
  } = useQuery({
    // 데이터, 로딩중인지, 에러발생
    queryKey: ["comment", postCode, page],
    queryFn: () => viewComment(postCode, page),
    // refetchInterval: 1000, // 해당 시간마다 데이터갱식하여 실시간 처럼 처리
  });

  // 댓글 추가
  const addmutation = useMutation({
    mutationFn: addCommentAPI,
    onSuccess: (result) => {
      if (result.data !== "실패") {
        queryClient.invalidateQueries({ queryKey: ["comment", postCode] });
      } else {
        alert("댓글 작성이 제한된 상태입니다");
      }
      // 스크롤 이벤트가 안댐...
    },
  });

  // 댓글추가
  const addComment = () => {
    if (newComment.commentContent !== "") {
      addmutation.mutate(newComment); // 리액트쿼리
      setNewComment({ ...newComment, commentContent: "" });
    }
  };

  const loadingPost = async () => {
    const response = await viewPost(postCode);
    setPost(response.data);
  };
  // 좋아요 확인
  const {
    data: likeState,
    isLoading: likeLoading,
    error: likeError,
  } = useQuery({
    queryKey: ["likeState", postCode],
    queryFn: () => (token ? state(postCode) : null), // 토큰이 없으면 호출하지 않음
    enabled: !!token,
  });

  // 좋아요
  const likeMutation = useMutation({
    mutationFn: like,
    onSuccess: () => {
      queryClient.invalidateQueries(["likeState", postCode]);
    },
  });

  // 좋아요 취소
  const unLikeMutation = useMutation({
    mutationFn: unLike,
    onSuccess: () => {
      queryClient.invalidateQueries(["likeState", postCode]);
    },
  });
  const likeSubmit = () => {
    // 게시글 코드와 유저 정보 보내서 추천 테이블에 추가
    if (token !== null) {
      const postLike = {
        postCode: postCode,
        userEmail: user?.userEmail,
      };
      likeMutation.mutate(postLike);
    }
    setPost({
      ...post,
      likeCount: post?.likeCount + 1,
    });
  };

  const unLikeSubmit = () => {
    // 게시글 추천 코드 보내서 테이블에서 삭제
    unLikeMutation.mutate(likeState.data?.postLikeCode);
    setPost({
      ...post,
      likeCount: post?.likeCount - 1,
    });
  };
  const enterAdd = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      addComment();
    }
  };
  const removePost = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      await remove(postCode);
      // 삭제후 해당 게시판으로 이동
      window.location.href =
        "/channel/" +
        post?.channelCode +
        "/" +
        post?.channelTag?.channelTagCode;
    }
  };
  const setGrade = async () => {
    if (localStorage.getItem("token") !== null) {
      const response = await checkGrade(user.userEmail, postCode);
      console.log(response);
      setRole(response.data);
    }
  };

  useEffect(() => {
    console.log(role);
    loadingPost();
    setGrade();
  }, []);

  // 시점이 다를때마다 useEffect 추가

  // 데이터 로딩중일 때 처리
  if (isLoading) return <>로딩중...</>;
  if (likeLoading) return <>로딩중...</>;
  // 에러 발생시 처리
  if (error) return <>에러발생...</>;
  if (likeError) return <>에러발생...</>;

  return (
    <div className="post-detail-box">
      <div className="post-detail">
        <h1 className="post-title">{post?.postTitle}</h1>
        <TimeFormat time={post?.postCreatedAt} />
        <div>조회수 :{post?.postViews} </div>
        <div>작성자 :{post?.user?.userNickname} </div>
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
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post?.postContent }}
        />
        <div>추천수 : {post?.likeCount}</div>
        {!token ? null : likeState.data ? (
          <button onClick={unLikeSubmit}>추천취소</button>
        ) : (
          <button onClick={likeSubmit}>추천</button>
        )}
        {token && post?.user?.userEmail === user.userEmail && (
          <>
            <Link
              to="/write"
              state={{ isPost: post, isChannelCode: post?.channelCode }}
            >
              수정
            </Link>
            <button onClick={removePost}>삭제</button>
          </>
        )}

        <div className="comment">
          {token && (
            <>
              <div className="comment-form">
                <input
                  className="comment-add"
                  type="text"
                  placeholder="댓글 추가.."
                  value={newComment.commentContent}
                  onChange={(e) => {
                    setNewComment({
                      ...newComment,
                      commentContent: e.target.value,
                    });
                  }}
                  onKeyUp={(e) => enterAdd(e)}
                />
                <div className="comment-add-status">
                  <button
                    type="button"
                    className="comment-submit"
                    onClick={addComment}
                  >
                    등록
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="comment-list">
            {isLoading &&
            likeLoading &&
            Array.isArray(commentList.data.commentList) ? (
              <p>댓글이 없습니당</p>
            ) : (
              commentList.data.commentList.map((comment) => (
                <CommentComponent
                  id={comment.commentCode}
                  comment={comment}
                  postCode={postCode}
                  key={comment.commentCode}
                  isOpenUser={isOpenUser}
                  userMenuToggle={userMenuToggle}
                  role={role}
                />
              ))
            )}
          </div>

          <Page
            page={page}
            totalPages={Math.ceil(commentList.data?.paging.totalPage / 10)}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
