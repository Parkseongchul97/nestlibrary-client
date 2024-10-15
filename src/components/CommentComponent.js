import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addComment as addAPI,
  updateComment as updateAPI,
  removeComment as deleteAPI,
} from "../api/comment";
const CommentComponent = ({ comment, postCode }) => {
  const { user } = useAuth();
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

  return (
    <div className="comment-content">
      {comment?.commentContent === null ? (
        <p>삭제된 댓글입니다...</p>
      ) : (
        <>
          {" "}
          <div className="user-profile">
            <p className="user-profile-nickname">
              {comment?.user?.userNickname}
            </p>
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
            <p
              onClick={() =>
                setChangeComment({
                  ...changeComment,
                  commentCode: comment.commentCode,
                  commentParentsCode: comment.commentParentsCode,
                })
              }
            >
              {comment.commentContent}
            </p>
          )}
          <button onClick={() => deleteComment(comment.commentCode)}>
            삭제
          </button>
        </>
      )}
      <button
        onClick={() =>
          setNewReComment({
            ...newReComment,
            commentParentsCode: comment.commentCode,
          })
        }
      >
        ㄴ답글
      </button>
      {newReComment.commentParentsCode === comment.commentCode && (
        <>
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
          <div className="reply-add-status">
            <button
              onClick={() =>
                setNewReComment({
                  ...newReComment,
                  commentContent: "",
                  commentParentsCode: 0,
                })
              }
            >
              취소
            </button>
            <button onClick={addReComment}>답글</button>
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
