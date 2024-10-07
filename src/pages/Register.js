import { useState, useEffect } from "react";
import "../assets/register.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { nicknameCheck, register } from "../api/user";
import { checkEmail, sendEmail } from "../api/email";
import { FaCheck } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null); // 이미지 미리보기
  const [userDTO, setUserDTO] = useState({
    userEmail: "",
    userPassword: "",
    userNickname: "",
    userImgUrl: null,
    userInfo: "",
  });
  const [checkPassword, setcheckPassword] = useState("");
  const [code, setCode] = useState("");
  const [nicknameSubmit, setnicknameSubmit] = useState(false);
  const [emailSubmit, setEmailSubmit] = useState(false);
  const [codeSubmit, setCodeSubmit] = useState(false);
  const emailRegExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
  const pwdRegExp =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  const submit = async () => {
    console.log(userDTO.userNickname.length);
    if (userDTO.userNickname.length < 2 || 11 < userDTO.userNickname) {
      alert("닉네임은 2~10 글자 내로 만들어야 합니다.");
      return;
    }
    if (!nicknameSubmit) {
      alert("중복 닉네임입니다!");
      return;
    }

    if (!emailRegExp.test(userDTO.userEmail)) {
      alert("이메일 형식에 맞춰주세요!");
      return;
    }
    if (!emailSubmit) {
      alert("이메일 인증을 완료해주십시오!");
      return;
    }
    if (!codeSubmit) {
      alert("코드 입력을 다시 해주세요!");
      return;
    }
    if (!pwdRegExp.test(userDTO.userPassword)) {
      alert("비밀번호 형식에 맞춰주세요");
      return;
    }
    if (checkPassword !== userDTO.userPassword) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }
    // 통과하면 ?
    // 회원가입 로직
    let formData = new FormData();
    formData.append("userEmail", userDTO.userEmail);
    formData.append("userPassword", userDTO.userPassword);
    if (userDTO.userImgUrl !== null)
      formData.append("userImgUrl", userDTO.userImgUrl);
    formData.append("userNickname", userDTO.userNickname);
    formData.append("userInfo", userDTO.userInfo);
    const result = await register(formData);
    if (result.status === 200) {
      alert("회원가입 성공!");
      navigate("/");
    } else {
      navigate("/");
    }
  };
  const deleteImg = () => {
    setUserDTO({ ...userDTO, userImgUrl: null });
    setPreviewUrl(null);
  };
  const sendUserEmail = async () => {
    if (!emailRegExp.test(userDTO.userEmail)) {
      alert("이메일 주소를 형식에 맞춰주세요!");
      return;
    }
    console.log(userDTO.userEmail);
    const result = await sendEmail(userDTO.userEmail);
    if (result) {
      setEmailSubmit(true); // 이메일 발송 성공
      setCodeSubmit(false); // 이메일 인증 누르면 코드 false
      alert("이메일 발송에 성공했습니다!");
    } else {
      setEmailSubmit(false); // 이메일 발송 실패
      alert("이미 해당 이메일로 가입한 회원이 있습니다.");
    }
  };
  const checkNickname = async () => {
    console.log("닉네임 : " + userDTO.userNickname);
    const result = await nicknameCheck(userDTO.userNickname); // 닉네임 중복 체크 호출
    console.log(result.data);
    setnicknameSubmit(result.data);
  };

  const checkEmailCode = async () => {
    const result = await checkEmail(code);
    if (result.data) {
      alert("인증이 완료되었습니다.");
      setCodeSubmit(true);
    } else {
      alert("코드를 다시 확인해 주십시오!");
      setCodeSubmit(false);
    }
  };

  useEffect(() => {
    if (userDTO.userNickname !== "") {
      checkNickname();
    }
  }, [userDTO.userNickname]);

  const enterSubmit = (e, type) => {
    if (type === "email")
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        sendUserEmail();
      }
    if (type === "code")
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        checkEmailCode();
      }
    if (type === "submit")
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        submit();
      }
  };

  return (
    <>
      <div className="main-box">
        <div id="register-box">
          <h1>회원가입</h1>
          <div className="input-box">
            <input
              className="register-input-text"
              placeholder={"이메일을 입력해주세요."}
              type="text"
              value={userDTO.userEmail}
              onChange={(e) =>
                setUserDTO({ ...userDTO, userEmail: e.target.value })
              }
              onKeyDown={(e) => enterSubmit(e, "email")}
              disabled={codeSubmit}
            />

            <button
              className="submit-btn"
              onClick={sendUserEmail}
              disabled={emailSubmit}
            >
              이메일 인증 발송
            </button>
          </div>

          <div className="text-div">
            아이디를 이메일 형식으로 입력해 주세요. 예: example@naver.com
          </div>
          <span id="email-span" className="submit-span">
            {userDTO.userEmail === "" ? (
              ""
            ) : !emailRegExp.test(userDTO.userEmail) ? (
              "이메일 주소 형식에 맞춰주세요"
            ) : !emailSubmit ? (
              ""
            ) : (
              <FaCheck color="green" />
            )}
          </span>
          <div className="input-box">
            <input
              className="register-input-text"
              placeholder={"이메일인증번호 입력"}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => enterSubmit(e, "code")}
              disabled={!emailSubmit}
            />

            <button className="submit-btn" onClick={checkEmailCode}>
              이메일 인증 확인
            </button>
          </div>
          <span id="code-span" className="submit-span">
            {!emailSubmit ? (
              ""
            ) : codeSubmit ? (
              <FaCheck color="green" />
            ) : (
              "인증 대기중"
            )}
          </span>
          <div className="input-box">
            <input
              className="register-input-text"
              placeholder="비밀번호"
              type="password"
              value={userDTO.userPassword}
              onChange={(e) =>
                setUserDTO({ ...userDTO, userPassword: e.target.value })
              }
              onKeyDown={(e) => enterSubmit(e, "submit")}
            />
          </div>
          <div className="text-div">
            영문자,숫자,특수문자를 포함한 8~16자리로 구성된 비밀번호를
            입력해주십시오.
          </div>
          <span id="password-span" className="submit-span">
            {userDTO.userPassword === "" ? (
              ""
            ) : !pwdRegExp.test(userDTO.userPassword) ? (
              "영문자,숫자,특수문자를 포함한 8~16자리"
            ) : (
              <FaCheck color="green" />
            )}
          </span>

          <div className="input-box">
            <input
              className="register-input-text"
              placeholder="비밀번호 확인"
              type="password"
              value={checkPassword}
              onChange={(e) => setcheckPassword(e.target.value)}
              onKeyDown={(e) => enterSubmit(e, "submit")}
            />
          </div>

          <span id="password-check-span" className="submit-span">
            {checkPassword === "" ? (
              ""
            ) : checkPassword !== userDTO.userPassword ? (
              "비밀번호가 일치하지 않습니다"
            ) : (
              <FaCheck color="green" />
            )}
          </span>
          <div className="input-box">
            <input
              className="register-input-text"
              placeholder="닉네임"
              type="text"
              value={userDTO.userNickname}
              onChange={(e) =>
                setUserDTO({ ...userDTO, userNickname: e.target.value })
              }
              onKeyDown={(e) => enterSubmit(e, "submit")}
            />
          </div>
          <div className="text-div">
            닉네임은 2~10글자 내외로 작성해주십시오.
          </div>
          <span id="nickname-span" className="submit-span">
            {userDTO.userNickname === "" ? (
              ""
            ) : userDTO.userNickname.length < 2 ||
              userDTO.userNickname.length > 10 ? (
              "2~10글자 내외로 작성하십시오."
            ) : !nicknameSubmit ? (
              "중복 닉네임 입니다."
            ) : (
              <FaCheck color="green" />
            )}
          </span>
          <div className="input-box">
            <input
              className="register-input-text"
              placeholder="나의 한마디"
              type="text"
              value={userDTO.userInfo}
              onChange={(e) =>
                setUserDTO({ ...userDTO, userInfo: e.target.value })
              }
              onKeyDown={(e) => enterSubmit(e, "submit")}
            />
          </div>
          <div id="preview-box">
            <label htmlFor="img-file" className="img-box">
              {previewUrl ? (
                <img id="preview-img" src={previewUrl} alt="프로필 미리보기" />
              ) : (
                <img
                  id="preview-img"
                  src="http://192.168.10.51:8082/thumbnail/%EA%B8%B0%EB%B3%B8%EC%9D%B4%EB%AF%B8%EC%A7%80.png"
                  alt="프로필 미리보기"
                />
              )}
            </label>
            <button className="submit-btn" id="img-delete" onClick={deleteImg}>
              이미지 삭제
            </button>
          </div>
          <input
            className="register-input-file"
            id="img-file"
            type="file"
            accept={"image/*"}
            onChange={(e) => {
              const file = e.target.files[0]; // 첫 번째 파일 가져오기
              if (file) {
                // 있으면
                setUserDTO({ ...userDTO, userImgUrl: file });
                setPreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 설정
              } else {
                setUserDTO({ ...userDTO, userImgUrl: null });
                setPreviewUrl(null);
              }
            }}
          />

          <div id="btn-box">
            <Link to={"/"} className="submit-btn">
              뒤로가기
            </Link>
            <button className="submit-btn" onClick={submit}>
              제출
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
