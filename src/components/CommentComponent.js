import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addComment as addAPI,
  updateComment as updateAPI,
  removeComment as deleteAPI,
} from "../api/comment";
import TimeFormat from "./TimeFormat";
import "../assets/comment.scss";
const CommentComponent = ({ comment, postCode }) => {
  const { user, token } = useAuth();
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
  const [isRecom, setIsRecom] = useState(0);
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
  const recommentTogle = () => {
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
  return (
    <div className="comment-content-box">
      {comment?.commentContent === null ? (
        <div className="comment-content">
          <p className="none-comment">삭제된 댓글입니다...</p>
        </div>
      ) : (
        <>
          {" "}
          <div className="comment-content">
            <div className="user-profile">
              <img
                className="user-profile-img"
                src={
                  comment?.user?.userImgUrl != null
                    ? "http://192.168.10.51:8083/user/" +
                      comment?.user?.userEmail +
                      "/" +
                      comment?.user?.userImgUrl
                    : "http://192.168.10.51:8083/e0680940917fba1b2350c6563c32ad0c.jpg"
                }
              />
              <p className="user-profile-nickname">
                {comment?.user?.userNickname}
                <TimeFormat time={comment.commentCreatedAt} />
              </p>
            </div>
            {isChange === comment.commentCode &&
            user !== undefined &&
            user.userEmail === comment?.user?.userEmail ? (
              <>
                <div className="edit-content">
                  <input
                    type="text"
                    value={changeComment.commentContent}
                    onChange={(e) =>
                      setChangeComment({
                        ...changeComment,
                        commentContent: e.target.value,
                      })
                    }
                  />
                  <button onClick={() => setIsChange(0)}>수정취소</button>
                  <button onClick={updateComment}>수정</button>
                </div>
              </>
            ) : (
              <p className="comment-text">{comment.commentContent}</p>
            )}
            <div className="btn-box">
              {/*이거나 관리자인 경우*/}
              {user.userEmail === comment?.user?.userEmail && (
                <>
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
                    수정하기
                  </button>
                  <button onClick={() => deleteComment(comment.commentCode)}>
                    삭제
                  </button>
                </>
              )}
              {token && <button onClick={recommentTogle}>ㄴ답글</button>}
            </div>
          </div>
        </>
      )}

      {newReComment.commentParentsCode === comment.commentCode && (
        <>
          <div className="recommnet-form">
            <input
              type="text"
              placeholder="답글 추가.."
              value={newReComment.commentContent}
              onChange={(e) =>
                setNewReComment({
                  ...newReComment,
                  commentContent: e.target.value,
                  commentParentsCode: comment.commentCode,
                })
              }
            />
            <div className="re-add-status">
              <button onClick={addReComment}>답글</button>
            </div>
          </div>
        </>
      )}
      {comment?.reCommentDTO?.map((reCommentDTO) => (
        <CommentComponent
          comment={reCommentDTO}
          postCode={postCode}
          key={reCommentDTO.commentCode}
        />
      ))}
    </div>
  );
};
export default CommentComponent;
