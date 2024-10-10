import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import "../assets/login.scss";
import { useState } from "react";
import { login } from "../api/user";
import Btn from "../components/Btn";
import KakaoLogin from "../components/kakaoLogin";

const Login = ({ onClose, setToken, setUser }) => {
  const [loginUser, setLoginUser] = useState({
    userEmail: "",
    userPassword: "",
  });

  const submit = async () => {
    console.log(loginUser);
    const result = await login(loginUser);
    try {
      if (result.status === 200) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("userEmail", result.data.userEmail);
        localStorage.setItem("userNickname", result.data.userNickname);
        localStorage.setItem("userImgUrl", result.data.userImgUrl);
        localStorage.setItem("userInfo", result.data.userInfo);
        localStorage.setItem("userPoint", result.data.userPoint);
        setToken(result.data.token);
        setUser({
          userEmail: result.data.userEmail,
          userNickname: result.data.userNickname,
          userImgUrl: result.data.userImgUrl,
          userInfo: result.data.userInfo,
          userPoint: result.data.userPoint,
        });
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
            <div className="input-box">
              <input
                placeholder="이메일 아이디"
                type="text"
                value={loginUser.userEmail}
                onChange={(e) =>
                  setLoginUser({ ...loginUser, userEmail: e.target.value })
                }
                className={"login-input-text"}
                onKeyDown={(e) => enterLogin(e)}
              />
            </div>
            <div className="input-box">
              <input
                placeholder="비밀번호"
                type={"password"}
                value={loginUser.userPassword}
                onChange={(e) =>
                  setLoginUser({ ...loginUser, userPassword: e.target.value })
                }
                className={"login-input-text"}
                onKeyDown={(e) => enterLogin(e)}
              />
            </div>

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
          <KakaoLogin />
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
