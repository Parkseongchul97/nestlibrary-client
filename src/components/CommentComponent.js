import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addComment as addAPI,
  updateComment as updateAPI,
  removeComment as deleteAPI,
} from "../api/comment";
import "../assets/comment.scss";
import UserMenu from "./UserMenu";
import { FaFeatherPointed } from "react-icons/fa6";
const CommentComponent = ({
  channelCode,
  comment,
  postCode,
  id,
  isOpenUser,
  userMenuToggle,
  isWriter,
}) => {
  const { user, token } = useAuth();
  const [isPostUser, setIsPostUser] = useState(false);
  const [newReComment, setNewReComment] = useState({
    commentContent: "",
    postCode: postCode,
    userEmail: user?.userEmail,
    commentParentsCode: 0,
  });
  const [changeComment, setChangeComment] = useState({
    commentCode: 0,
    commentContent: "",
    postCode: postCode,
    userEmail: user?.userEmail,
    commentParentsCode: 0,
  });

  const [isChange, setIsChange] = useState(0); // 수정 체크
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment", postCode] });
    },
  });

  const upadteMutation = useMutation({
    mutationFn: updateAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment", postCode] });
    },
  });
  const removeMutation = useMutation({
    mutationFn: deleteAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment", postCode] });
    },
  });
  const addReComment = () => {
    addMutation.mutate(newReComment);

    setNewReComment({
      ...newReComment,
      commentContent: "",
      commentParentsCode: 0,
    });
  };

  const updateComment = () => {
    upadteMutation.mutate(changeComment);
    setChangeComment({
      commentContent: "",
      postCode: postCode,
      userEmail: user?.userEmail,
      commentParentsCode: 0,
    });
    setIsChange(0);
  };
  const deleteComment = (commentCode) => {
    removeMutation.mutate(commentCode);
  };
  const recommentToggle = () => {
    if (newReComment.commentParentsCode === 0)
      setNewReComment({
        ...newReComment,
        commentParentsCode: comment.commentCode,
      });
    else {
      setNewReComment({
        ...newReComment,
        commentParentsCode: 0,
      });
    }
  };

  const enterSubmit = (e, type) => {
    if (type === "add")
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        addReComment();
      }
    if (type === "update")
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        updateComment();
      }
  };
  useEffect(() => {
    setIsPostUser(isWriter === comment.user.userEmail);
  }, [isWriter]);
  return (
    <div className="comment-content-box" id={"comment-code-" + id}>
      {comment?.commentContent === null ? (
        <div className="comment-content">
          <p className="none-comment">삭제된 댓글입니다...</p>
        </div>
      ) : (
        <>
          {" "}
          <div
            className={
              user?.userEmail === comment?.user?.userEmail
                ? "comment-content-my"
                : isPostUser
                ? "comment-content-writer"
                : "comment-content"
            }
          >
            <UserMenu
              user={comment?.user}
              time={comment?.commentCreatedAt}
              isOpenUser={isOpenUser === comment.commentCode}
              userMenuToggle={() => userMenuToggle(comment.commentCode)}
              channelCode={channelCode}
            />

            {isChange === comment.commentCode &&
            user !== undefined &&
            user.userEmail === comment?.user?.userEmail ? (
              <>
                <div className="edit-comment-form">
                  <input
                    className="edit-comment-add"
                    type="text"
                    value={changeComment.commentContent}
                    onChange={(e) =>
                      setChangeComment({
                        ...changeComment,
                        commentContent: e.target.value,
                      })
                    }
                    onKeyDown={(e) => enterSubmit(e, "update")}
                  />
                  <button onClick={updateComment}>변경</button>
                </div>
              </>
            ) : (
              <>
                <p className="comment-text">
                  {isPostUser && <FaFeatherPointed />}
                  {comment.commentContent}
                </p>
              </>
            )}

            <div className="btn-box">
              {/*이거나 관리자인 경우*/}
              {user.userEmail === comment?.user?.userEmail && (
                <>
                  {isChange !== 0 ? (
                    <button onClick={() => setIsChange(0)}>취소</button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsChange(comment.commentCode);
                        setChangeComment({
                          ...changeComment,
                          commentCode: comment.commentCode,
                          commentContent: comment.commentContent,
                          commentParentsCode: comment.commentParentsCode,
                        });
                      }}
                    >
                      수정
                    </button>
                  )}
                  <button onClick={() => deleteComment(comment.commentCode)}>
                    삭제
                  </button>
                </>
              )}
              {token && <button onClick={recommentToggle}>ㄴ답글</button>}
            </div>
          </div>
        </>
      )}

      {newReComment.commentParentsCode === comment.commentCode && (
        <>
          <div className="re-comment-form">
            <input
              type="text"
              placeholder="답글 추가.."
              className="re-comment-add"
              value={newReComment.commentContent}
              onChange={(e) =>
                setNewReComment({
                  ...newReComment,
                  commentContent: e.target.value,
                  commentParentsCode: comment.commentCode,
                })
              }
              onKeyDown={(e) => enterSubmit(e, "add")}
            />
            <div className="re-comment-add-status">
              <button className="re-comment-submit" onClick={addReComment}>
                등록
              </button>
            </div>
          </div>
        </>
      )}
      {comment?.reCommentDTO?.map((reCommentDTO) => (
        <CommentComponent
          comment={reCommentDTO}
          postCode={postCode}
          id={reCommentDTO.commentCode}
          key={reCommentDTO.commentCode}
          isOpenUser={isOpenUser}
          userMenuToggle={userMenuToggle}
          channelCode={channelCode}
          isWriter={isWriter}
        />
      ))}
    </div>
  );
};
export default CommentComponent;
