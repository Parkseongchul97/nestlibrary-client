import React, { useEffect, useState } from "react";
import TimeFormat from "../TimeFormat";
import "../../assets/userMenu.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { addRole, removeRole } from "../../api/management";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { loginUserChannelGrade, userChannelGrade } from "../../api/management";
import { sendCode, checkEmail } from "../../api/email";
import { FaRegCheckCircle, FaBan } from "react-icons/fa";
import MessageWrite from "../messages/MessageWrite";
import { useNavigate } from "react-router-dom";

const UserMenu = ({
  user,
  channelCode,
  time,
  isOpenUser,
  userMenuToggle,
  noneImg,
}) => {
  const [managementDTO, setManagementDTO] = useState({
    userEmail: user?.userEmail,
    managementUserStatus: "",
    channelCode: "",
    banDate: 0,
  });

  const handleRadioChange = (e) => {
    setManagementDTO({
      ...managementDTO,
      userEmail: user?.userEmail,
      banDate: e.target.value,
      managementUserStatus: "ban",
      channelCode: loginUserGrade?.channel.channelCode,
    });
  };

  const [isHost, setIsHost] = useState(false);
  const [code, setCode] = useState("");
  const [reCode, setReCode] = useState(false);

  const { user: loginUser, token } = useAuth();

  const [loginUserGrade, setloginUserGrade] = useState(null); // 로그인유저

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpenMessage, setIsOpenMessage] = useState(false);
  const {
    data: userGrade,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["gradeCheck", channelCode, user?.userEmail],
    queryFn: () => userChannelGrade(channelCode, user?.userEmail),
    enabled: !!channelCode,
    // refetchInterval: 1000,
  });

  const loginGrade = async () => {
    const response = await loginUserChannelGrade(channelCode);
    setloginUserGrade(response.data);
  };

  const gradeChangeSubmit = (dto) => {
    if (dto?.managementUserStatus === "admin") {
      submitRoleMutation.mutate(dto);
    } else if (dto?.managementUserStatus === "host") {
      submitRoleMutation.mutate(dto);
    } else {
      submitRoleMutation.mutate(managementDTO);
    }

    userMenuToggle();
  };

  useEffect(() => {
    if (channelCode !== undefined && channelCode !== null && token !== null)
      loginGrade();
  }, [channelCode, token]);

  const banCanle = () => {
    removeRoleMutatoin.mutate(userGrade?.data?.managementCode);
    userMenuToggle();

    queryClient.invalidateQueries(["gradeCheck", channelCode, user.userEmail]);
  };

  useEffect(() => {
    setbanOpen(false);
    setIsHost(false);
    setManagementDTO({
      ...managementDTO,
      userEmail: user?.userEmail,
      banDate: "",
      managementUserStatus: "",
      channelCode: "",
    });
  }, [isOpenUser]);

  const [banOpen, setbanOpen] = useState(false);

  const removeRoleMutatoin = useMutation({
    mutationFn: removeRole,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "gradeCheck",
        channelCode,
        user?.userEmail,
      ]);
    },
  });

  const submitRoleMutation = useMutation({
    mutationFn: addRole,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "gradeCheck",
        channelCode,
        user.userEmail,
      ]);
    },
  });

  const getCode = async () => {
    setReCode(true);
    await sendCode(loginUser.userEmail);
    alert("인증번호가 발송되었습니다");
  };
  const submitCode = async (info) => {
    const response = await checkEmail(code);
    if (response.data) {
      alert("인증번호가 일치합니다");
      gradeChangeSubmit(info);
      setCode("");
    } else {
      alert("인증번호가 일치하지 않습니다");
      setCode("");
    }
  };
  const goUserPage = () => {
    navigate("/user/" + user.userEmail);
  };

  if (isLoading) return <>로딩중</>;
  if (error) return <>에러;;</>;
  return (
    <div className="user-profile-box">
      <div
        className="user-profile"
        onClick={
          token === null
            ? goUserPage
            : loginUser.userEmail === user?.userEmail && !noneImg
            ? goUserPage
            : userMenuToggle
        }
      >
        {!noneImg && (
          <img
            className="user-profile-img"
            src={
              user !== undefined && user?.userImgUrl !== null
                ? "http://192.168.10.51:8083/user/" +
                  user?.userEmail +
                  "/" +
                  user?.userImgUrl
                : "http://192.168.10.51:8083/e0680940917fba1b2350c6563c32ad0c.jpg"
            }
          />
        )}
        <div className="user-nickname-box">
          <p className="user-profile-nickname">
            {userGrade?.data !== undefined &&
            userGrade?.data?.managementUserStatus === "host" ? (
              <FaRegCheckCircle
                style={{ color: "orange", marginRight: "5px" }}
              />
            ) : userGrade?.data?.managementUserStatus === "admin" ? (
              <FaRegCheckCircle style={{ color: "blue", marginRight: "5px" }} />
            ) : userGrade?.data?.managementUserStatus === "ban" ? (
              <FaBan style={{ color: "red", marginRight: "5px" }} />
            ) : (
              channelCode !== undefined && (
                <FaRegCheckCircle
                  style={{ color: "black", marginRight: "5px" }}
                />
              )
            )}
            {user?.userNickname}
          </p>
        </div>
        {time !== undefined && (
          <div className="time-box">
            {" "}
            <TimeFormat time={time} />
          </div>
        )}
      </div>
      {isOpenUser && token && loginUser.userEmail !== user?.userEmail && (
        <div className="profile-actions">
          <div
            className="user-accordion"
            onClick={() => setIsOpenMessage(true)}
          >
            쪽지 쓰기
          </div>
          {isOpenMessage && (
            <MessageWrite
              toUser={{
                toUser: {
                  email: user.userEmail,
                  nickname: user.userNickname,
                },
              }}
              isOpenMessage={isOpenMessage}
              setIsOpenMessage={setIsOpenMessage}
            />
          )}
          <Link className="user-accordion" to={"/user/" + user.userEmail}>
            유저페이지로 이동
          </Link>

          {loginUserGrade?.managementUserStatus == "host" && (
            <>
              {userGrade?.data?.managementUserStatus !== "ban" ? (
                <div
                  className="user-accordion"
                  onClick={() => {
                    setbanOpen(!banOpen);
                    setManagementDTO({
                      userEmail: user?.userEmail,
                      managementUserStatus: "",
                      channelCode: "",
                      banDate: 0,
                    });
                  }}
                >
                  차단하기
                </div>
              ) : (
                <div
                  className="user-accordion"
                  onClick={() => setbanOpen(!banOpen)}
                >
                  벤풀기
                </div>
              )}
              {banOpen && userGrade?.data?.managementUserStatus !== "ban" && (
                <>
                  <label className="user-accordion2">
                    <input
                      type="radio"
                      name={`option-${user?.userEmail}`}
                      value="1"
                      onChange={handleRadioChange}
                    />
                    1일
                  </label>
                  <label className="user-accordion2">
                    <input
                      type="radio"
                      name={`option-${user?.userEmail}`}
                      value="7"
                      onChange={handleRadioChange}
                    />
                    1주일
                  </label>
                  <label className="user-accordion2">
                    <input
                      type="radio"
                      name={`option-${user?.userEmail}`}
                      value="30"
                      onChange={handleRadioChange}
                    />
                    1달
                  </label>
                  <label className="user-accordion2">
                    <input
                      type="radio"
                      name={`option-${user?.userEmail}`}
                      value="365"
                      onChange={handleRadioChange}
                    />
                    1년
                  </label>
                  <label className="user-accordion2">
                    <input
                      type="radio"
                      name={`option-${user?.userEmail}`}
                      value="99999"
                      onChange={handleRadioChange}
                    />
                    영구벤
                  </label>
                  {managementDTO.banDate > 0 && (
                    <div
                      className="user-accordion3"
                      onClick={gradeChangeSubmit}
                    >
                      확인
                    </div>
                  )}
                </>
              )}
              {banOpen && userGrade?.data?.managementUserStatus === "ban" && (
                <>
                  <div className="user-accordion">
                    {userGrade?.data?.managementDeleteAt}
                  </div>
                  <button onClick={banCanle}>벤 풀기</button>
                </>
              )}
              {userGrade?.data?.managementUserStatus != "admin" &&
                userGrade?.data?.managementUserStatus != "ban" && (
                  <div
                    className="user-accordion"
                    onClick={() => {
                      gradeChangeSubmit({
                        userEmail: user.userEmail,
                        banDate: 0,
                        managementUserStatus: "admin",
                        channelCode: loginUserGrade?.channel.channelCode,
                      });
                    }}
                  >
                    관리자로임명{" "}
                  </div>
                )}

              {userGrade?.data?.managementUserStatus == "admin" && (
                <>
                  <div className="user-accordion" onClick={banCanle}>
                    관리자 취소
                  </div>
                  <div
                    className="user-accordion"
                    onClick={() => setIsHost(!isHost)}
                  >
                    호스트로 임명
                  </div>
                  {isHost && (
                    <>
                      <>
                        <a>가입하신 이메일로 인증번호가 발송됩니다</a>
                        <input
                          placeholder="인증번호를 입력해주세요"
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                        <button onClick={getCode}>
                          {reCode ? "인증번호 재발송" : "인증번호 발송"}
                        </button>
                        <button
                          onClick={() =>
                            submitCode({
                              userEmail: user.userEmail,
                              banDate: "",
                              managementUserStatus: "host",
                              channelCode: loginUserGrade?.channel.channelCode,
                            })
                          }
                        >
                          확인
                        </button>
                      </>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
