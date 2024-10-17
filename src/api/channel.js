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
export const allPosts = async (channelCode, page, target, keyword) => {
  console.log("호출됨 !! 페이지 : " + page);
  const response = await instance.get(
    `/${channelCode}?page=${
      page === undefined || page === null ? 1 : page
    }&target=${target === undefined || target === null ? "" : target}&keyword=${
      keyword === undefined || keyword === null ? "" : keyword
    }`
  );
  return response; // 모든 게시글 데이터 반환
};

// 채널 태그별 게시글 API
export const tagPosts = async (
  channelCode,
  channeltagCode,
  page,
  target,
  keyword
) => {
  const response = await instance.get(
    `/${channelCode}/${channeltagCode}?page=${
      page === undefined || page === null ? 1 : page
    }&target=${target === undefined || target === null ? "" : target}&keyword=${
      keyword === undefined || keyword === null ? "" : keyword
    }`
  );
  return response; // 특정 태그의 게시글 데이터 반환
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
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
