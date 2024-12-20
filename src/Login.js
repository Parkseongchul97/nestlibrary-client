import { IoIosArrowBack } from "react-icons/io";
import KakaoLogin from "./components/kakaoLogin.js";

const Login = ({ onClose }) => {
  return (
    <>
      <div className="login-box">
        <div className="login-header">
          <button className="close" onClick={onClose}>
            <IoIosArrowBack />
          </button>
          <h3>로그인</h3>
        </div>
        <div className="login-body">
          <form className="login-form">
            <input placeholder="아이디" />
            <input placeholder="비밀번호" />

            <div className="findId">
              <a href="">ID/PW 찾기</a>
            </div>
            <button type="submit">로그인</button>
          </form>
          <div className="message">
            <span>아직 회원이 아니신가요?</span>
            <a href="">회원가입 하기</a>
            <KakaoLogin />
          </div>
        </div>
      </div>
      <div className="login-bg" onClick={onClose}></div>
    </>
  );
};

export default Login;
