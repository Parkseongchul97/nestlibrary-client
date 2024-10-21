import { useEffect } from "react";
import { kakaologin } from "../user/kakaoCode";
import { useAuth } from "../contexts/AuthContext";

const LoginWait = () => {
  const kakaoKey = new URL(window.location.href).searchParams.get("code");
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const kakao = async () => {
      if (kakaoKey) {
        const result = await kakaologin({ code: kakaoKey }); // 객체 형태로 보내기
        authLogin(result.data);
        window.location.href = "/";
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
