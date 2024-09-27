import { useState, useEffect, useRef } from "react";
import "../assets/register.scss";

const Register = () => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const updateCheckRef = useRef(false);
  const [user, setUser] = useState([]);

  const emailInput = (e) => {
    setEmail(e.target.value); // 입력할때마다 값을 넣음
  };
  const nicknameInput = (e) => {
    setNickname(e.target.value); // 입력할때마다 값을 넣음
  };
  useEffect(() => {
    if (!updateCheckRef.current) {
      updateCheckRef.current = true;
      return;
    } else {
      console.log("이메일 : " + email);
      console.log("닉네임 : " + nickname);
      // input 채크할 곳
    }
  }, [email, nickname]);
  return (
    <>
      <div className="main-box">
        <h1>회원가입</h1>
        <div id="register-box">
          <label>
            이메일ID :
            <input
              onChange={emailInput}
              id="user-email"
              type="text"
              name="{email}"
              value={email}
            />
          </label>
          <label>
            비밀번호 :
            <input id="password" type="password" name="{password}" />
          </label>
          <label>
            비밀번호 확인 :
            <input id="password-check" type="password" />
          </label>
          <label>
            닉네임 :
            <input onChange={nicknameInput} id="nickname" type="text" />
          </label>
          <label>
            프로필 사진
            <input id="nickname" type="file" accept="image/*" />
          </label>
          <div id="btn-box">
            <button>뒤로가기</button>
            <button>등록</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
