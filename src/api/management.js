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
// 유저매뉴 유저 등급
export const userChannelGrade = async (channelCode, userEmail) => {
  return await instance.get(`${channelCode}/${userEmail}`);
};

export const loginUserChannelGrade = async (channelCode) => {
  return await authorize.get(`grade/${channelCode}`);
};

export const userRole = async (data) => {
  const response = await authorize.put("/subscribe/role", data);
  return response;
};
