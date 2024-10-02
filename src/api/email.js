import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/email/",
});

export const sendEmail = async (userEmail) => {
  try {
    const response = await instance.get("code", {
      params: { userEmail },
    });
    //console.log(response.data);
    if (parseInt(response.data) > 0) {
      console.log("발송 성공");
      return true; // 발송성공
    } else {
      console.log("중복?");
      return false; // 코드 -1 (중복 이메일)
    }
  } catch (error) {
    return false; // 오류 발생 시 false 반환
  }
};

export const checkEmail = async (code) => {
  return await instance.post("code?code=" + code);
};
