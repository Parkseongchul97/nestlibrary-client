import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateChannel from "./CreateChannel";
import { nicknameCheck, updateUser, getUserInfo } from "../api/user";
import { myChannel } from "../api/channel";
import "../assets/mypage.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ChangePassword from "../pages/ChangePassword";

const Mypage = () => {
  const navigate = useNavigate();
  const [channel, setChannel] = useState([]);
  const [isChange, setIsChange] = useState(false);

  const [createPage, setCreatePage] = useState(false);
  // changeImg : -1 = (기존꺼 그대로), 0 =(변경), 1 =(이미지 삭제만)
  const [changeImg, setChangeImg] = useState(-1);
  const closeCreateChannel = () => {
    setCreatePage(false);
  };
  const openCreateChannel = () => {
    setCreatePage(true);
  };
  const { user, login, logout } = useAuth();
  const [previewUrl, setPreviewUrl] = useState(
    user.userImgUrl != null
      ? "http://192.168.10.51:8083/user/" +
          user.userEmail +
          "/" +
          user.userImgUrl
      : null
  );

  const [nicknameSubmit, setNicknameSubmit] = useState(true);

  const [userDTO, setUserDTO] = useState({});
  const findUser = async () => {
    const result = await getUserInfo(localStorage.getItem("userEmail"));
    setUserDTO({
      userEmail: result.data.userEmail,
      userNickname: result.data.userNickname,
      userImg: null,
      userInfo: result.data.userInfo,
      userPoint: result.data.userPoint,
      userPassword: result.data.userPassword, // 카카오 때문에 추가
    });
  };

  useEffect(() => {
    findUser();
    myChannelInfo();
  }, []);
  const deleteImg = () => {
    setUserDTO({ ...userDTO, userImg: null });
    setPreviewUrl(null);
    setChangeImg(1);
  };
  const resetImg = () => {
    setUserDTO({ ...userDTO, userImg: null });
    setPreviewUrl(
      user.userImgUrl != null
        ? "http://192.168.10.51:8083/user/" +
            user.userEmail +
            "/" +
            user.userImgUrl
        : null
    );
    setChangeImg(-1);
  };

  useEffect(() => {
    if (
      userDTO.userNickname !== undefined &&
      userDTO.userNickname !== user.userNickname
    ) {
      checkNickname();
    }
  }, [userDTO.userNickname]);

  const checkNickname = async () => {
    const result = await nicknameCheck(userDTO.userNickname, userDTO.userEmail); // 닉네임 중복
    if (result.data !== undefined || result.data !== "") {
    }
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
    // 이미지 변경 + 기존 이미지그대로
    if (userDTO.userImg !== null) formData.append("userImg", userDTO.userImg);
    formData.append("userNickname", userDTO.userNickname);
    formData.append("userInfo", userDTO.userInfo);
    // 이미지 변경여부 -1(변경X), 0(변경), 1(이미지 삭제)
    formData.append("changeImg", changeImg);
    // 기존꺼랑 바뀐거랑 비교 랑 포인트 소모는 백단에서
    // 무엇을 바꿨냐에 따라서 포인트 소모량 차이나게 담기
    const result = await updateUser(formData);
    if (result.status === 200) {
      alert("정보수정 완료!");
      // 유저 정보 수정값 담아줘야함
      logout(true);
      login(result.data);
      window.location.href = "/";
    } else {
      alert("회원정보를 수정할 수 없습니다!");
      navigate("/mypage");
    }
  };

  const myChannelInfo = async () => {
    const response = await myChannel(user.userEmail);
    if (response.data !== "") {
      setChannel(response.data);
    }
  };

  return (
    <>
      <div className="main-box">
        <div className="info-box">
          <div className="info-change-header">
            <h1>마이 페이지</h1>
          </div>
          <div className="info-change-main">
            <div className="info-change-left">
              <p className="management-channel-title">관리 채널</p>
              {channel.map((channels) => (
                <Link
                  className="management-channel-list"
                  to={`/update/${channels?.channelCode}`}
                  key={channels?.channelCode}
                >
                  {channels?.channelName}
                </Link>
              ))}

              <button className="create-channel" onClick={openCreateChannel}>
                채널생성
              </button>
            </div>
            <div className="info-change-right">
              <div className="change-top-box">
                <div className="change-img-box">
                  <label htmlFor="img-file" className="user-img-box">
                    {previewUrl ? (
                      <img
                        id="preview-img"
                        src={previewUrl}
                        alt="프로필 미리보기"
                      />
                    ) : (
                      <img
                        id="preview-img"
                        src="http://192.168.10.51:8083/e0680940917fba1b2350c6563c32ad0c.jpg"
                        alt="프로필 미리보기"
                      />
                    )}
                  </label>
                  <div className="info-change-text">
                    * 프로필사진 변경에는 100pt가 소모됩니다.
                  </div>
                </div>
                <div className="change-top-right">
                  <div className="point-text">
                    내 잔여 포인트 : {userDTO.userPoint}
                  </div>
                  {userDTO.userPassword != null ? (
                    <div
                      className="change-password"
                      onClick={() => setIsChange(!isChange)}
                    >
                      비밀번호 변경{" "}
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        (window.location.href =
                          "https://accounts.kakao.com/weblogin/find_password?continue=%2Flogin%3Fcontinue%3Dhttps%253A%252F%252Fcs.kakao.com%252Fhelps_html%252F1073185489%253Flocale%253Dko%26talk_login%3D&lang=ko")
                      }
                    >
                      비밀번호 변경{" "}
                    </div>
                  )}
                  <div className="update-btn-box">
                    <button id="user-img-delete" onClick={deleteImg}>
                      이미지 삭제
                    </button>
                    <button id="user-img-reset" onClick={resetImg}>
                      이미지 되돌리기
                    </button>
                  </div>
                </div>
              </div>
              <div className="change-bottom-box">
                <div className="change-input-box">
                  <label htmlFor="input-nickname">닉네임</label>
                  <input
                    className="change-input-text"
                    placeholder="닉네임"
                    type="text"
                    value={userDTO.userNickname || ""}
                    onChange={(e) =>
                      setUserDTO({ ...userDTO, userNickname: e.target.value })
                    }
                  />
                  <div className="info-change-text">
                    * 닉네임 변경에는 500pt가 소모됩니다.
                  </div>
                </div>

                <div className="change-input-box">
                  <label htmlFor="input-info">나의 한마디</label>
                  <input
                    className="change-input-text"
                    placeholder="나의 한마디"
                    type="text"
                    value={userDTO.userInfo || ""}
                    onChange={(e) =>
                      setUserDTO({ ...userDTO, userInfo: e.target.value })
                    }
                  />
                  <div className="change-submit-box">
                    <button id="change-submit" onClick={submit}>
                      변경사항 수정
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <input
        className="change-input-file"
        id="img-file"
        type="file"
        accept={"image/*"}
        onChange={(e) => {
          const file = e.target.files[0]; // 첫 번째 파일 가져오기
          if (file) {
            // 있으면
            setUserDTO({ ...userDTO, userImg: file });
            setPreviewUrl(URL.createObjectURL(file));
            setChangeImg(0);
            // 미리보기 URL 설정
          } else {
            setUserDTO({ ...userDTO, userImg: null });
            setPreviewUrl(null);
            setChangeImg(1);
          }
        }}
      />

      {createPage && <CreateChannel onClose={closeCreateChannel} />}
      {isChange && <ChangePassword onClose={setIsChange} />}
    </>
  );
};
export default Mypage;
