import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/user/",
});

export const kakaologin = async (data) => {
  return await instance.post("kakaoLogin", data);
};
