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
  return await instance.get(`grade/${channelCode}/${userEmail}`);
};
// 로그인 유저의 해당 채널 등급
export const loginUserChannelGrade = async (channelCode) => {
  return await authorize.get(`grade/${channelCode}`);
};

export const userRole = async (data) => {
  const response = await authorize.put("/subscribe/role", data);
  return response;
};

export const addRole = async (data) => {
  const response = await authorize.post("/role", data);
  return response;
};

export const removeRole = async (managementCode) => {
  const response = await authorize.delete(`/role/${managementCode}`);
  return response;
};

export const everyRole = async (
  channelCode,
  userNickname,
  managementUserStatus
) => {
  const params = {
    channelCode,
    userNickname,
    managementUserStatus,
  };

  const response = await authorize.get(`/management/user`, { params });
  return response.data; // 필요에 따라 데이터를 반환
};

export const allPost = async (channelCode, userNickname) => {
  const response = await authorize.get(
    `/management/${channelCode}/${userNickname}`
  );
  return response.data;
};
