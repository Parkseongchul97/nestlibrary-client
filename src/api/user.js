import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/user/",
});
export const register = async (data) => {
  // 파라미터로 data 받아서감 (바디로 받음)
  console.log(data);
  return await instance.post("register", data);
};
