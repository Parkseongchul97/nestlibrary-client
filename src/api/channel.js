import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});
const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private/channel/",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
export const channelInfo = async (channelCode) => {
  const response = await instance.get(`/channel/${channelCode}`);
  return response; // 채널 정보 반환
};

// 전체 게시글 API
export const allPosts = async (channelCode) => {
  const response = await instance.get(`/${channelCode}`);
  return response; // 모든 게시글 데이터 반환
};

// 채널 태그별 게시글 API
export const tagPosts = async (channelCode, channeltagCode) => {
  const response = await instance.get(`/${channelCode}/${channeltagCode}`);
  return response; // 특정 태그의 게시글 데이터 반환
};

export const allChannel = async () => {
  return await instance.get("channel/main");
};

export const create = async (data) => {
  // 파라미터로 data 받아서감 (바디로 받음)

  return await authorize.post("channel/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const nameCheck = async (channelName, channelCode) => {
  return await instance.get(
    `channel/name?channelName=${channelName}&channelCode=${channelCode}`
  );
};
