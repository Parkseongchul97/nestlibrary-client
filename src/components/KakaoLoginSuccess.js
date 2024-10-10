import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LoginSuccess = () => {
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
