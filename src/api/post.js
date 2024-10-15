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

export const add = async (data) => {
  await authorize.post("/post", data);
};
// 게시글의 댓글 보여주기, (페이징 처리 추가 필요)
export const viewPost = async (postCode) => {
  return await instance.get(`post/${postCode}`);
};
