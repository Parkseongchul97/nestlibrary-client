import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/channel/",
});
const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private/channel/",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
export const main = async (channelCode) => {
  console.log("이동경로 코드 : " + channelCode);
  return await instance.get(`${channelCode}`);
};

export const allChannel = async () => {
  return await instance.get("main");
};

export const create = async (data) => {
  // 파라미터로 data 받아서감 (바디로 받음)

  return await instance.post("create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const nameCheck = async (channelName, channelCode) => {
  return await instance.get(
    `name?channelName=${channelName}&channelCode=${channelCode}`
  );
};
