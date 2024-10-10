import { useEffect, useState } from "react";
import { kakaologin } from "../user/kakaoCode";
import { useNavigate } from "react-router-dom";

const LoginWait = () => {
  const kakaoKey = new URL(window.location.href).searchParams.get("code");

  console.log(kakaoKey);
  useEffect(() => {
    const kakao = async () => {
      if (kakaoKey) {
        try {
          const result = await kakaologin({ code: kakaoKey }); // 객체 형태로 보내기
          console.log("Login result:", result.status); // 결과 로그

          localStorage.setItem("token", result.data.token);
          localStorage.setItem("email", result.data.userEmail);
          localStorage.setItem("nickname", result.data.userNickname);
          localStorage.setItem("img", result.data.img);

          window.location.href = "/";
        } catch (error) {
          console.error("로그인 실패:", error.message);
        }
      }
    };
    kakao();
  }, [kakaoKey]); // kakaoKey가 변경될 때마다 effect 실행

  return (
    <>
      <div>로그인 중입니당</div>
    </>
  );
};

export default LoginWait;
