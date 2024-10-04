import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LoginSuccess = () => {
  // URL에서 토큰 추출
  // 토큰 로컬 스토리지에 저장

  // 메인 페이지로 이동
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;

    localStorage.setItem("token", urlParams.get("token"));
    alert(localStorage.getItem("token"));
    alert("gd");
    navigate("/");
  }, []);

  return null;
};
export default LoginSuccess;
