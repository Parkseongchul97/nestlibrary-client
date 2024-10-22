import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/user/",
});
const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private/user/",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
export const register = async (data) => {
  // 파라미터로 data 받아서감 (바디로 받음)

  return await instance.post("register", data);
};

export const nicknameCheck = async (nickname, userEmail) => {
  try {
    const response = await instance.get("nickname", {
      params: { nickname, userEmail },
    });
    return response; // boolean 값 반환
  } catch (error) {
    return false; // 오류 발생 시 false 반환
  }
};
export const login = async (data) => {
  try {
    return await instance.post("login", data);
  } catch (error) {
    new Error("LOGIN");
    return "error";
  }
};

export const getUserInfo = async (userEmail) => {
  return await authorize.get("info?userEmail=" + userEmail);
};
export const updateUser = async (data) => {
  return await authorize.put("update", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const updatePass = async (userEmail, userPassword) => {
  return await authorize.put(
    `/password?userEmail=${userEmail}&userPassword=${userPassword}`
  );
};
