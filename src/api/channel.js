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

export const allChannel = async (page, keyword = "") => {
  return await instance.get("main", {
    params: {
      page,
      keyword, // 키,값이 명칭이 같을 경우 생략가능
    },
  });
};

export const create = async (data) => {
  // 파라미터로 data 받아서감 (바디로 받음)

  return await authorize.post("create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const nameCheck = async (channelName, channelCode) => {
  return await instance.get(
    `name?channelName=${channelName}&channelCode=${channelCode}`
  );
};

export const updateInfo = async (channelCode) => {
  return await authorize.get(`/update/${channelCode}`);
};

export const addTags = async (data) => {
  return await authorize.post("/tag", data);
};

export const removeTags = async (channelTagCode) => {
  await authorize.delete(`/tag/${channelTagCode}`);
};

export const infoUpdate = async (data) => {
  await authorize.put("/update", data);
};

export const addImg = async (data) => {
  await authorize.put("/channelImg", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
