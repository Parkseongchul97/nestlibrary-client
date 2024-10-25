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
export const bestPosts = async (channelCode, page, target, keyword) => {
  const response = await instance.get(
    `/${channelCode}/best?page=${
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
  return response; // 모든 인기 게시글 데이터 반환
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
// 채널 태그별 게시글 API
export const tagBestPosts = async (
  channelCode,
  channeltagCode,
  page,
  target,
  keyword
) => {
  const response = await instance.get(
    `/${channelCode}/${channeltagCode}/best?page=${
      page === undefined || page === null ? 1 : page
    }&target=${target === undefined || target === null ? "" : target}&keyword=${
      keyword === undefined || keyword === null ? "" : keyword
    }`
  );
  return response; // 특정 태그의 게시글 데이터 반환
};

export const allChannel = async (page, keyword = "") => {
  return await instance.get("channel/main", {
    params: {
      page,
      keyword, // 키,값이 명칭이 같을 경우 생략가능
    },
  });
};

export const subChannel = async (page, keyword = "") => {
  return await authorize.get("/main", {
    params: {
      page,
      keyword, // 키,값이 명칭이 같을 경우 생략가능
    },
  });
};

export const create = async (data) => {
  // 파라미터로 data 받아서감 (바디로 받음)

  return await authorize.post("/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// 이름체크
export const nameCheck = async (channelName, channelCode) => {
  return await instance.get(
    `channel/name?channelName=${channelName}&channelCode=${channelCode}`
  );
};

// 채널  수정시 정보 불러오기
export const updateInfo = async (channelCode) => {
  return await authorize.get(`/update/${channelCode}`);
};
// 채널 태그 추가
export const addTags = async (data) => {
  return await authorize.post("/tag", data);
};
// 채널 태그 삭제
export const removeTags = async (channelTagCode) => {
  await authorize.delete(`/tag/${channelTagCode}`);
};
// 채널 소개 수정
export const infoUpdate = async (data) => {
  await authorize.put("/update", data);
};
// 이미지 변경
export const addImg = async (data) => {
  await authorize.put("/channelImg", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// 채널 삭제
export const removeChannel = async (channelCode) => {
  await authorize.delete(`/${channelCode}`);
};

// 내 채널

export const myChannel = async (userEmail) => {
  return await authorize.get(`${userEmail}`);
};

// 등급체크
export const checkGrade = async (userEmail, postCode) => {
  return await authorize.get(`${userEmail}/${postCode}`);
};
