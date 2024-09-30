import { useState, useEffect, useRef } from "react";
import "../assets/register.scss";
import Input from "../components/Input";
import Btn from "../components/Btn";
import { useNavigate } from "react-router-dom";
import { nicknameCheck, register } from "../api/user";

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
  const [nicknameSubmit, setnicknameSubmit] = useState(false);

  const submit = async () => {
    const emailRegExp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
    const pwdRegExp =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!nicknameSubmit) {
      alert("중복 닉네임입니다!");
      return;
    }
    if (!emailRegExp.test(userDTO.userEmail)) {
      alert("이메일 형식에 맞춰주세요!");
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
  const checkNickname = async () => {
    const result = await nicknameCheck(userDTO.userNickname); // 닉네임 중복 체크 호출
    if (result.data) {
      setnicknameSubmit(true); // 닉네임이 중복이 아님
    } else {
      setnicknameSubmit(false); // 닉네임이 중복임
    }
  };
  useEffect(() => {
    if (userDTO.userNickname !== "") {
      checkNickname();
    }
  }, [userDTO.userNickname]);

  return (
    <>
      <div className="main-box">
        <h1>회원가입</h1>
        <div id="register-box">
          <Input
            label={"이메일"}
            placeholder={"이메일을 입력해주세요."}
            type={"text"}
            value={userDTO.userEmail}
            change={(e) =>
              setUserDTO({ ...userDTO, userEmail: e.target.value })
            }
          />
          <Input
            label={"비밀번호"}
            placeholder={"비밀번호를 입력해주세요."}
            type={"password"}
            value={userDTO.userPassword}
            change={(e) =>
              setUserDTO({ ...userDTO, userPassword: e.target.value })
            }
          />
          <Input
            label={"비밀번호 확인"}
            placeholder={"비밀번호를 다시 입력해주세요."}
            type={"password"}
            value={checkPassword}
            change={(e) => setcheckPassword(e.target.value)}
          />
          <Input
            id="nickname"
            label={"닉네임"}
            placeholder={"닉네임을 입력해주세요."}
            type={"text"}
            value={userDTO.userNickname}
            change={(e) =>
              setUserDTO({ ...userDTO, userNickname: e.target.value })
            }
          />

          <Input
            label={"프로필 사진"}
            type={"file"}
            accept={"image/*"}
            change={(e) => {
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
          <div className="img-box">
            {previewUrl ? (
              <img id="preview-img" src={previewUrl} alt="프로필 미리보기" />
            ) : (
              <p>이미지 미리보기</p>
            )}
          </div>
          <Input
            label={"자기소개"}
            placeholder={"자기소개를 입력해주세요."}
            type={"text"}
            value={userDTO.userInfo}
            change={(e) => setUserDTO({ ...userDTO, userInfo: e.target.value })}
          />

          <div id="btn-box">
            <Btn text={"뒤로가기"}></Btn>
            <Btn text={"제출"} click={submit} />
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
