import "../assets/changePassword.scss";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { login, updatePass } from "../api/user";
import { IoIosArrowBack } from "react-icons/io";
import { set } from "lodash";

const ChangePassword = ({ onClose }) => {
  const { user, logout: authLogout } = useAuth();
  const [newCheck, setNewCheck] = useState(false);
  const [newpass, setNewPass] = useState("");
  const [newpass2, setNewPass2] = useState("");
  const [loginUser, setLoginUser] = useState({
    userEmail: user !== null ? user.userEmail : "",
    userPassword: "",
  });
  const pwdRegExp =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

  useEffect(() => {
    if (pwdRegExp.test(newpass) || pwdRegExp.test(newpass2)) {
      setNewCheck(false);
    }

    if (pwdRegExp.test(newpass)) {
      if (newpass === newpass2 && newpass.length > 0) {
        setNewCheck(true);
      } else {
        setNewCheck(false);
      }
    }
  }, [newpass, newpass2]);

  const check = async () => {
    const response = await login(loginUser);
    if (response == "error") {
      alert("현재 비밀번호 입력 오류 입니다");
    } else if (response.data != null) {
      if (newCheck) {
        await updatePass(user.userEmail, newpass);
        alert("비밀번호 변경에 성공하셨습니다!");
        authLogout();
        window.location.href = "/";
      }
    }
  };

  return (
    <>
      <div>
        <div className="password-box">
          <div className="password-header">
            <button className="close" onClick={() => onClose(false)}>
              <IoIosArrowBack />
            </button>
            <h3>비밀번호 변경</h3>
            <div className="balance"></div>
          </div>
          <div className="password-body">
            <div className="password-form">
              <div className="password-input-box">
                <input
                  placeholder="현재 비밀번호"
                  type="password"
                  className={"password-input-text"}
                  value={loginUser.userPassword}
                  onChange={(e) =>
                    setLoginUser({ ...loginUser, userPassword: e.target.value })
                  }
                />
              </div>
              <div className="password-input-box">
                <input
                  placeholder="새 비밀번호"
                  type="password"
                  className={"password-input-text"}
                  value={newpass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                {newpass.length > 0 && !pwdRegExp.test(newpass) ? (
                  <span className="warning">
                    영문자,숫자,특수문자를 포함한 8~16자리로 구성된 비밀번호를
                    입력해주십시오.
                  </span>
                ) : newpass.length > 0 && !newCheck ? (
                  <span className="warning">불일치</span>
                ) : newpass.length > 0 && newCheck ? (
                  <span className="no-warning">일치</span>
                ) : null}
                <input
                  placeholder="새 비밀번호 확인"
                  type="password"
                  className={"password-input-text"}
                  value={newpass2}
                  onChange={(e) => setNewPass2(e.target.value)}
                />
              </div>

              <button
                id="login-submit"
                type="submit"
                onClick={check}
                disabled={!newCheck}
              >
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
