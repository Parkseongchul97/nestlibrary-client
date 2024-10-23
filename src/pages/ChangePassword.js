import "../assets/login.scss";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { login, updatePass } from "../api/user";
import { set } from "lodash";

const ChangePassword = () => {
  const { user } = useAuth();
  const [oldCheck, setOldCheck] = useState(false);
  const [newCheck, setNewCheck] = useState(false);
  const [newpass, setNewPass] = useState("");
  const [newpass2, setNewPass2] = useState("");
  const [loginUser, setLoginUser] = useState({
    userEmail: user.userEmail,
    userPassword: "",
  });
  const pwdRegExp =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

  useEffect(() => {
    if (pwdRegExp.test(newpass)) {
      if (newpass === newpass2 && newpass.length > 0) {
        setNewCheck(true);
      } else {
        setNewCheck(false);
      }
    }
  }, [newpass, newpass2]);

  const check = async () => {
    alert(newCheck);
    const response = await login(loginUser);
    if (response == "error") {
      alert("비번오류");
    } else if (response.data != null) {
      setOldCheck(true);
      alert("데이터 전송하면 될듯?");

      await updatePass(user.userEmail, newpass);
    }
  };

  return (
    <>
      <div>
        <div className="login-box">
          <div className="login-header">
            <button className="close"></button>
            <h3>비밀번호 변경</h3>
            <div className="balance"></div>
          </div>
          <div className="login-body">
            <div className="login-form">
              <div className="input-box">
                <input
                  placeholder="현재 비밀번호"
                  type="password"
                  className={"login-input-text"}
                  value={loginUser.userPassword}
                  onChange={(e) =>
                    setLoginUser({ ...loginUser, userPassword: e.target.value })
                  }
                />
              </div>
              <div className="input-box">
                <input
                  placeholder="새 비밀번호"
                  type="password"
                  className={"login-input-text"}
                  value={newpass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                {newpass.length > 0 && !pwdRegExp.test(newpass) ? (
                  <span>형식오류</span>
                ) : newpass.length > 0 && !newCheck ? (
                  <span>불일치</span>
                ) : newpass.length > 0 && newCheck ? (
                  <span>일치</span>
                ) : null}
                <input
                  placeholder="새 비밀번호 확인"
                  type="password"
                  className={"login-input-text"}
                  value={newpass2}
                  onChange={(e) => setNewPass2(e.target.value)}
                />
              </div>

              <button id="login-submit" type="submit" onClick={check}>
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
