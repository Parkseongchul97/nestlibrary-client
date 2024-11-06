import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import "../assets/login.scss";
import { useState } from "react";
import { login } from "../api/user";
import KakaoLogin from "../components/user/kakaoLogin";
import { useAuth } from "../contexts/AuthContext";
import { findpass } from "../api/email";

const Login = ({ onClose }) => {
  const { login: authLogin } = useAuth();
  const [loginUser, setLoginUser] = useState({
    userEmail: "",
    userPassword: "",
  });

  const [passCheck, setPassCheck] = useState(false);

  const submit = async () => {
    const result = await login(loginUser);
    console.log(result === "error");
    if (result === "error") {
      alert("아이디 또는 비밀번호가 틀립니다!");
      setLoginUser({
        userEmail: "",
        userPassword: "",
      });
    } else {
      authLogin(result.data);
      window.location.reload();
      alert("로그인 성공!");
      onClose();
    }
  };

  const find = async () => {
    const result = await findpass(loginUser.userEmail);
    if (result === 1) {
      alert("올바르지 않은 이메일입니다");
    } else if (result === 2) {
      alert("소셜계정은 해당 서비스에서 찾으셔야 합니다");
    } else if (result === 3) {
      alert("임시 비밀번호를 전송하였습니다");
    }
  };

  const enterLogin = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      submit();
    }
  };

  return (
    <>
      {!passCheck ? (
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
                    type="password"
                    value={loginUser.userPassword}
                    onChange={(e) =>
                      setLoginUser({
                        ...loginUser,
                        userPassword: e.target.value,
                      })
                    }
                    className={"login-input-text"}
                    onKeyDown={(e) => enterLogin(e)}
                  />
                </div>

                <div className="findId">
                  <span onClick={() => setPassCheck(true)}>비밀 번호 찾기</span>
                </div>
                <button id="login-submit" type="submit" onClick={submit}>
                  로그인
                </button>
              </div>
              <KakaoLogin />
              <div className="message">
                <Link id="register-message" to={"/register"} onClick={onClose}>
                  <span>아직 회원이 아니신가요?</span> 회원가입하기
                </Link>
              </div>
            </div>
          </div>
          <div className="login-bg" onClick={onClose}></div>
        </div>
      ) : (
        <div>
          <div className="login-box">
            <div className="login-header">
              <button className="close" onClick={onClose}>
                <IoIosArrowBack />
              </button>
              <h3>비밀번호 찾기</h3>
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
                <div className="findId">
                  <span onClick={() => setPassCheck(false)}>로그인</span>
                </div>

                <button id="login-submit" type="submit" onClick={find}>
                  찾기
                </button>
              </div>
              <KakaoLogin />
              <div className="message">
                <Link id="register-message" to={"/register"} onClick={onClose}>
                  <span>아직 회원이 아니신가요?</span> 회원가입하기
                </Link>
              </div>
            </div>
          </div>
          <div className="login-bg" onClick={onClose}></div>
        </div>
      )}
    </>
  );
};

export default Login;
