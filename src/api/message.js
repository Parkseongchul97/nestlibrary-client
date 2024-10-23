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

// 수신 유저 찾기
export const findUser = async (userNickname) => {
  return await authorize.get(`user?userNickname=${userNickname}`);
};
// 발송
export const addMessage = async (data) => {
  return await authorize.post("messages", data);
};
export const removeMessage = async (messagesCode) => {
  return await authorize.delete(`messages/${messagesCode}`);
};
// 내가 받은거중 아직 안본
export const noOpenMessage = async (page, target, keyword) => {
  return await authorize.get(
    `messages?page=${page !== undefined ? page : 1}&target=${
      keyword === undefined ||
      keyword === null ||
      target === undefined ||
      target === null
        ? ""
        : target
    }&keyword=${keyword === undefined || keyword === null ? "" : keyword}`
  );
};
// 내가 보내거나 받은
export const allMessage = async (page, target, keyword) => {
  return await authorize.get(
    `messages/all?page=${page !== undefined ? page : 1}&target=${
      keyword === undefined ||
      keyword === null ||
      target === undefined ||
      target === null
        ? ""
        : target
    }&keyword=${keyword === undefined || keyword === null ? "" : keyword}`
  );
};
// 내가 받은
export const toMessage = async (page, target, keyword) => {
  return await authorize.get(
    `messages/to?page=${page !== undefined ? page : 1}&target=${
      keyword === undefined ||
      keyword === null ||
      target === undefined ||
      target === null
        ? ""
        : target
    }&keyword=${keyword === undefined || keyword === null ? "" : keyword}`
  );
};
// 내가 보낸
export const fromMessage = async (page, target, keyword) => {
  return await authorize.get(
    `messages/from?page=${page !== undefined ? page : 1}&target=${
      keyword === undefined ||
      keyword === null ||
      target === undefined ||
      target === null
        ? ""
        : target
    }&keyword=${keyword === undefined || keyword === null ? "" : keyword}`
  );
};
// 1개 조회
export const oneMessage = async (messagesCode) => {
  return await authorize.get(`messages/${messagesCode}`);
};
export const isOpenMessgeCount = async () => {
  return await authorize.get(`messages/count`);
};
