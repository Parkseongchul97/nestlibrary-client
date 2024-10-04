import { useEffect, useState } from "react";
import { kakaologin } from "../user/kakaoCode";
import { useNavigate } from "react-router-dom";

const LoginWait = () => {
  const kakaoKey = new URL(window.location.href).searchParams.get("code");
  const navigate = useNavigate();
  useEffect(() => {
    const kakao = async () => {
      if (kakaoKey) {
        try {
          const result = await kakaologin({ code: kakaoKey }); // 객체 형태로 보내기
          console.log("Login result:", result.status); // 결과 로그
          console.log(result);
          console.log(result.data);
          localStorage.setItem("token", result.data);
          navigate("/");
        } catch (error) {
          console.error("로그인 실패:", error.message);
          navigate("/login");
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
