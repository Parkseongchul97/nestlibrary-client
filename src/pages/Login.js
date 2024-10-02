import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import "../assets/login.scss";
import Input from "../components/Input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/user";
import Btn from "../components/Btn";

const Login = ({ onClose, setToken }) => {
  const [loginCheck, setLoginCheck] = useState(true);
  const [user, setUser] = useState({
    userEmail: "",
    userPassword: "",
  });

  const submit = async () => {
    console.log(user);
    const result = await login(user);
    try {
      if (result.status === 200) {
        localStorage.setItem("token", result.data);
        console.log("토큰 : " + result.data); //
        setToken(result.data);
        setLoginCheck(false);
        alert("로그인 성공!");
        onClose();
      }
    } catch (error) {
      alert("로그인 실패");
    }
  };
  const enterLogin = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      submit();
    }
  };
  return (
    <div>
      <div className="login-box">
        <div className="login-header">
          <button className="close" onClick={onClose}>
            <IoIosArrowBack />
          </button>
          <h3>로그인</h3>
          <div className="balance"></div>
        </div>
        <div className="login-body">
          <div className="login-form">
            <Input
              placeholder="아이디"
              type={"text"}
              value={user.userEmail}
              change={(e) => setUser({ ...user, userEmail: e.target.value })}
              className={"login-input-text"}
              onKeyDown={(e) => enterLogin(e)}
            />
            <Input
              placeholder="비밀번호"
              type={"password"}
              value={user.userPassword}
              change={(e) => setUser({ ...user, userPassword: e.target.value })}
              className={"login-input-text"}
              onKeyDown={(e) => enterLogin(e)}
            />

            <div className="findId">
              <Link to={"/"}>비밀번호 찾기</Link>
            </div>
            <Btn
              id="login-submit"
              type="submit"
              click={submit}
              text={"로그인"}
            />
          </div>
          <div className="message">
            <Link id="register-message" to={"/register"} onClick={onClose}>
              <span>아직 회원이 아니신가요?</span>
              회원가입하기
            </Link>
          </div>
        </div>
      </div>
      <div className="login-bg" onClick={onClose}></div>
    </div>
  );
};

export default Login;
