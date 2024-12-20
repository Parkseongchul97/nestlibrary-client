import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/email/",
});

const authorize = axios.create({
  baseURL: "http://localhost:8080/api/email/private/",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
// 신규 가입시 인증코드 발송
export const sendEmail = async (userEmail) => {
  try {
    const response = await instance.get("code", {
      params: { userEmail },
    });
    if (parseInt(response.data) > 0) {
      return true; // 발송성공
    } else {
      return false; // 코드 -1 (중복 이메일)
    }
  } catch (error) {
    return false; // 오류 발생 시 false 반환
  }
};
// 채널삭제시 인증코드
export const sendCode = async (userEmail) => {
  try {
    const response = await authorize.get("code", {
      params: { userEmail },
    });
    return response.data;
  } catch (error) {
    return false; // 오류 발생 시 false 반환
  }
};

// 인증코드 일치 불일치 여부
export const checkEmail = async (code) => {
  return await instance.post("code?code=" + code);
};

// 임시 비번 보내기
export const findpass = async (userEmail) => {
  try {
    const response = await instance.get("findPassword", {
      params: { userEmail },
    });
    if (parseInt(response.data) === 1) {
      return 1; // 잘못입력한거임 이건
    } else if (parseInt(response.data) === 2) {
      return 2; //  소셜계정으로 시도 하고 있다
    } else if (parseInt(response.data) === 3) {
      return 3; //  임시비번이 보내졌다
    }
  } catch (error) {
    return false; // 오류 발생 시 false 반환
  }
};
