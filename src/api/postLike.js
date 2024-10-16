import axios from "axios";

const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private/",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
export const likeState = async (postCode) => {
  const response = await authorize.get(`state/${postCode}`);
  return response; // 조아용 여부
};
export const like = async (data) => {
  const response = await authorize.post("like", data);
  return response; // 조아용
};
export const unLike = async (postLikeCode) => {
  const response = await authorize.delete(`like/${postLikeCode}`);
  return response; // 조아용 취소
};
