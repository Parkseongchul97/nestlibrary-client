import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CommentComponent from "../post/CommentComponent";
import "../../assets/postDetail.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment as addCommentAPI, viewComment } from "../../api/comment";
import { viewPost } from "../../api/post";
import { likeState as state, like, unLike } from "../../api/postLike";
import Page from "../Page";
import { remove } from "../../api/post";
import UserMenu from "../user/UserMenu";
import { HiStar } from "react-icons/hi";
import { FaFire } from "react-icons/fa";
import { RiFireFill, RiFireLine } from "react-icons/ri";
import { loginUserChannelGrade } from "../../api/management";
const PostDetail = ({ postCode, page, loginUserGrade }) => {
  const [isOpenUser, setIsOpenUser] = useState(false);
  const { user, token } = useAuth();
  const location = useLocation();
  const [isComposing, setIsComposing] = useState(false);

  const query = new URLSearchParams(location.search);
  const [commentPage, setCommentPage] = useState(
    query.get("comment_page") || 1
  );

  const [postPage, setPostPage] = useState(page);
  const [newComment, setNewComment] = useState({
    commentContent: "",
    postCode: postCode,
    userEmail: user?.userEmail,
  });
  const [post, setPost] = useState(null);
  const [postUserEmail, setPostUserEmail] = useState("");
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
    queryKey: ["comment", postCode, commentPage],
    queryFn: () => viewComment(postCode, commentPage),
    // refetchInterval: 1000, // 해당 시간마다 데이터갱식하여 실시간 처럼 처리
  });

  // 댓글 추가
  const addmutation = useMutation({
    mutationFn: addCommentAPI,
    onSuccess: (result) => {
      if (result.data !== "실패") {
        queryClient.invalidateQueries({
          queryKey: ["comment", postCode, commentPage],
        });
        setCommentPage(
          commentList.data.paging.totalPage + (1 % 10) === 0
            ? Math.floor(commentList.data.paging.totalPage / 10)
            : Math.floor(commentList.data.paging.totalPage / 10 + 1)
        );
      } else {
        alert("댓글 작성이 제한된 상태입니다");
      }
      // 스크롤 이벤트가 안댐...
    },
  });

  // 댓글추가
  const addComment = () => {
    if (newComment.commentContent.trim() === "" && !isComposing) {
      return;
    } else {
      addmutation.mutate(newComment); // 리액트쿼리
      setNewComment({ ...newComment, commentContent: "" });
    }
  };

  const loadingPost = async () => {
    const response = await viewPost(postCode);
    setPost(response.data);
    setPostUserEmail(response.data.user.userEmail);
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
    if ((e.code === "Enter" || e.code === "NumpadEnter") && !isComposing) {
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

  useEffect(() => {
    loadingPost();
  }, [postCode, page]);
  useEffect(() => {
    setPostPage(page);
  }, [page]);

  useEffect(() => {
    setNewComment({
      commentContent: "",
      postCode: postCode,
      userEmail: user?.userEmail,
    });
  }, [postCode]);

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["comment", postCode, commentPage],
    });
  }, [commentPage]);
  useEffect(() => {
    setCommentPage(query.get("comment_page") || 1);
  }, [query.get("comment_page")]);

  // 시점이 다를때마다 useEffect 추가

  // 데이터 로딩중일 때 처리
  if (isLoading) return <>로딩중...</>;
  if (likeLoading) return <>로딩중...</>;
  // 에러 발생시 처리
  if (error) return <>에러발생...</>;
  if (likeError) return <>에러발생...</>;

  return (
    <div className="post-detail-box">
      <div className="post-header">
        <div className="post-header-top">
          <Link
            className="channel-tag"
            to={
              "/channel/" +
              post?.channelCode +
              "/" +
              post?.channelTag?.channelTagCode
            }
          >
            {post?.channelTag?.channelTagName === "공지" && "📢"}
            {post?.channelTag?.channelTagName}
          </Link>{" "}
          <h1 className="post-title">{post?.postTitle}</h1>
        </div>
        <div className="post-header-bottom">
          <div className="post-header-bottom-left">
            <UserMenu
              user={post?.user}
              isOpenUser={isOpenUser === post?.postCode}
              userMenuToggle={() => userMenuToggle(post?.postCode)}
              channelCode={post?.channelCode}
            />{" "}
          </div>
          <div className="post-header-bottom-right">
            <p>작성 시간 : {post?.postCreatedAt.split("T")[0]} </p>

            <p>조회수 : {post?.postViews}</p>
            <p>추천수 : {post?.likeCount}</p>
            <p>댓글수 : {post?.commentCount}</p>
          </div>
        </div>
      </div>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post?.postContent }}
      />
      <div className="post-like">
        {!token ? null : likeState.data ? (
          <>
            <RiFireFill
              className="un-like"
              onClick={unLikeSubmit}
              size={"7rem"}
              style={{
                borderRadius: "50%",
                backgroundColor: "orange",
                color: "red",
              }}
            />
          </>
        ) : (
          <>
            <RiFireFill
              className="like"
              onClick={likeSubmit}
              size={"7rem"}
              style={{
                border: "1px solid",
                borderRadius: "50%",
                backgroundColor: "#acacac",
                color: "white",
              }}
            />
          </>
        )}
      </div>
      <div className="post-edit">
        {token && post?.user?.userEmail === user.userEmail && (
          <>
            <Link
              className="edit-btn"
              to="/write"
              state={{ isPost: post, isChannelCode: post?.channelCode }}
            >
              수정
            </Link>
          </>
        )}
        {(post?.user?.userEmail === user.userEmail ||
          loginUserGrade?.managementUserStatus === "host") && (
          <>
            <p className="edit-btn" onClick={removePost}>
              삭제
            </p>
          </>
        )}
      </div>
      <div className="comment">
        <div className="comment-header">
          전체 댓글 수 [{post?.commentCount}]
        </div>
        <div className="comment-list">
          {isLoading &&
          likeLoading &&
          Array.isArray(commentList.data.commentList) ? (
            <p className="none-comment">댓글이 없습니당</p>
          ) : commentList.data.commentList.length > 0 ? (
            commentList.data.commentList.map((comment) => (
              <CommentComponent
                id={comment.commentCode}
                comment={comment}
                postCode={postCode}
                key={comment.commentCode}
                isOpenUser={isOpenUser}
                userMenuToggle={userMenuToggle}
                channelCode={post?.channelCode}
                isWriter={postUserEmail}
                loginUserGrade={loginUserGrade}
              />
            ))
          ) : (
            <p className="none-comment">댓글이 없습니당</p>
          )}
        </div>
        <div className="paging-box">
          <Page
            isComment={true}
            page={postPage}
            commentPage={commentPage}
            totalPages={Math.ceil(commentList.data?.paging.totalPage / 10)}
          />
        </div>
        {token && (
          <div className="comment-form-box">
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
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
