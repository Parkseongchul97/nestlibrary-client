import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/user/",
});

export const kakaologin = async (data) => {
  return await instance.post("kakaoLogin", data);
};

export const kakaoLogout = () => {
  const Rest_api_key = "376abff8d82b23a39e57639e3f0760ad"; //REST API KEY
  const redirect_uri = "http://localhost:3000"; //Redirect URI

  const kakaoURL = `https://kauth.kakao.com/oauth/logout?client_id=${Rest_api_key}&logout_redirect_uri=${redirect_uri}&response_type=code`;

  window.location.href = kakaoURL;
};
