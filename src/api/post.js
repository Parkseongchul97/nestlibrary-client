import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const add = async (data) => {
  return await authorize.post("/post", data);
};

export const update = async (data) => {
  return await authorize.put("/post", data);
};

export const write = async (channelCode) => {
  return await authorize.get(`/post/${channelCode}`);
};

export const remove = async (postCode) => {
  return await authorize.delete(`/post/${postCode}`);
};

// 게시글의 댓글 보여주기, (페이징 처리 추가 필요)
export const viewPost = async (postCode) => {
  return await instance.get(`post/${postCode}`);
};

export const getPageNum = async (postCode) => {
  return await authorize.get(`page/${postCode}`);
};

export const userPost = async (userEmail) => {
  return await instance.get(`/post/user/${userEmail}`);
};
