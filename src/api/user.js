import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/user/",
});
export const register = async (data) => {
  // 파라미터로 data 받아서감 (바디로 받음)

  return await instance.post("register", data);
};

export const nicknameCheck = async (nickname) => {
  try {
    const response = await instance.get("nickname", {
      params: { nickname },
    });
    return response; // boolean 값 반환
  } catch (error) {
    console.log("닉네임 체크 오류:", error);
    return false; // 오류 발생 시 false 반환
  }
};
