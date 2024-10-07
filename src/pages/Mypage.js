import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateChannel from "./Create-channel";
import { nicknameCheck, register } from "../api/user";
import "../assets/mypage.scss";
import { useNavigate } from "react-router-dom";

const Mypage = () => {
  const navigate = useNavigate();
  const [createPage, setCreatePage] = useState(false);
  const closeCreateChannel = () => {
    setCreatePage(false);
  };
  const openCreateChannel = () => {
    setCreatePage(true);
  };
  const [previewUrl, setPreviewUrl] = useState(null);
  const [nicknameSubmit, setNicknameSubmit] = useState(true);
  const [userDTO, setUserDTO] = useState({
    userEmail: "",
    // 초기값에 기존꺼 val 넣어야함
    userNickname: "",
    userImgUrl: null,
    userInfo: "",
    userPoint: "",
  });
  const deleteImg = () => {
    setUserDTO({ ...userDTO, userImgUrl: null });
    setPreviewUrl(null);
  };

  useEffect(() => {
    if (userDTO.userNickname !== "") {
      checkNickname();
    }
  }, [userDTO.userNickname]);

  const checkNickname = async () => {
    const result = await nicknameCheck(userDTO.userNickname); // 닉네임 중복
    setNicknameSubmit(result.data); // true false 반환 중복여부
  };
  const submit = async () => {
    if (userDTO.userNickname.length < 2 || 11 < userDTO.userNickname) {
      alert("닉네임은 2~10 글자 내로 만들어야 합니다.");
      return;
    }
    if (!nicknameSubmit) {
      alert("중복 닉네임입니다!");
      return;
    }
    let formData = new FormData();
    formData.append("userEmail", userDTO.userEmail);
    if (userDTO.userImgUrl !== null)
      formData.append("userImgUrl", userDTO.userImgUrl);
    formData.append("userNickname", userDTO.userNickname);
    formData.append("userInfo", userDTO.userInfo);
    // 기존꺼랑 바뀐거랑 비교하는 함수나 조건문 추가
    // 무엇을 바꿨냐에 따라서 포인트 소모량 차이나게 담기
    const result = await register(formData);
    if (result.status === 200) {
      alert("정보수정 완료!");
      navigate("/mypage");
    } else {
      alert("회원정보를 수정할 수 없습니다!");
      navigate("/mypage");
    }
  };
  return (
    <>
      <div className="main-box">
        <h1>마이 페이지</h1>
        <div id="info-change-box">
          <div className="change-input-box">
            <label htmlFor="input-nickname">닉네임 : </label>
            <input
              id="input-nickname"
              className="change-input-text"
              placeholder="닉네임"
              type="text"
              value={userDTO.userNickname}
              onChange={(e) =>
                setUserDTO({ ...userDTO, userNickname: e.target.value })
              }
            />
          </div>
          <div>닉네임 변경에는 500pt가 소모됩니다.</div>

          <div className="change-input-box">
            <label htmlFor="input-info">나의 한마디 : </label>
            <input
              id="input-info"
              className="change-input-text"
              placeholder="나의 한마디"
              type="text"
              value={userDTO.userInfo}
              onChange={(e) =>
                setUserDTO({ ...userDTO, userInfo: e.target.value })
              }
            />
          </div>
          <label htmlFor="img-file" className="user-img-box">
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
          <div>프로필사진 변경에는 100pt가 소모됩니다.</div>
          <button id="user-img-delete" onClick={deleteImg}>
            이미지 삭제
          </button>
          <input
            className="change-input-file"
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
          <button id="change-submit" onClick={submit}>
            변경사항 수정
          </button>
        </div>
        <button onClick={openCreateChannel}>채널생성</button>
      </div>
      {createPage && <CreateChannel onClose={closeCreateChannel} />}
    </>
  );
};
export default Mypage;
