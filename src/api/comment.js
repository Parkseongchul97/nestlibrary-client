import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});
const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private/",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// 게시글의 댓글 보여주기, (페이징 처리 추가 필요)
export const viewComment = async (postCode, commentPage) => {
  return await instance.get(
    `post/${postCode}/comment?comment_page=${
      commentPage === undefined || commentPage === null ? 1 : commentPage
    }`
  );
};

// 댓글 달기
export const addComment = async (data) => {
  return await authorize.post("comment", data);
};

export const updateComment = async (data) => {
  return await authorize.put("comment", data);
};

// 댓글 삭제
export const removeComment = async (commentCode) => {
  return await authorize.delete(`comment/${commentCode}`);
};
