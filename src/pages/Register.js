import { useState, useEffect, useRef } from "react";
import "../assets/register.scss";
import Input from "../components/Input";
import Btn from "../components/Btn";
import { useNavigate } from "react-router-dom";
import { register } from "../api/user";

const Register = () => {
  const navigate = useNavigate();
  const updateCheckRef = useRef(false);
  const [previewUrl, setPreviewUrl] = useState(null); // 이미지 미리보기
  const [userDTO, setUserDTO] = useState({
    userEmail: "",
    userPassword: "",
    userNickname: "",
    userImgUrl: null,
    userInfo: "",
  });
  const [checkPassword, setcheckPassword] = useState("");

  const submit = async () => {
    // 회원가입 로직
    console.log(userDTO);
    console.log("파일 객체 ? : " + userDTO.userImgUrl);
    let formData = new FormData();
    formData.append("userEmail", userDTO.userEmail);
    formData.append("userPassword", userDTO.userPassword);
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
  useEffect(() => {
    if (!updateCheckRef.current) {
      updateCheckRef.current = true;
      return;
    } else {
      //   const nicknameCheck = () => {
      //     // 닉네임 체크란
      //     if (userDTO.userNickname === "") {
      //       console.log("필수 입력값입니다.");
      //     }
      //   };
      //   // input 채크할 곳
    }
  }, []);
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
