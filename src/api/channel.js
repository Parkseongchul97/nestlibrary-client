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
  // 검색어와 타겟이 있어도 페이지 1페이지 호출해야함
  const response = await instance.get(
    `/${channelCode}?page=${
      page === undefined || page === null ? 1 : page
    }&target=${
      keyword === undefined ||
      keyword === null ||
      target === undefined ||
      target === null
        ? ""
        : target
    }&keyword=${keyword === undefined || keyword === null ? "" : keyword}`
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
