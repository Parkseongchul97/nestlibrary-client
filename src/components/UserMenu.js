import React, { useEffect, useState } from "react";
import TimeFormat from "./TimeFormat";
import "../assets/userMenu.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { loginUserChannelGrade, userChannelGrade } from "../api/management";

const UserMenu = ({ user, channelCode, time, isOpenUser, userMenuToggle }) => {
  const [userRoleDTO, setUserRoleDTO] = useState({
    userEmail: "",
    managementUserStatus: "",
    channelCode: "",
    banDate: "",
  });
  const [managementDTO, setManagementDTO] = useState({
    userEmail: user.userEmail,
    managementUserStatus: "",
    channelCode: channelCode,
    banDate: 0,
  });

  const { user: loginUser, token } = useAuth();
  const [userGrade, setUserGrade] = useState(null); // 해당유저
  const [loginUserGrade, setloginUserGrade] = useState(null); // 로그인유저

  // const getUserDTo = async (data) => {
  //   console.log(data);
  //   // if (data.type == "click") {
  //   //   if (userRoleDTO.banDate === "") {
  //   //     alert("기간 선택을 해주세요!");
  //   //     return;
  //   //   } else {
  //   //     setUserRoleDTO({
  //   //       ...userRoleDTO,
  //   //       managementUserStatus: "ban",
  //   //       userEmail: user.userEmail,
  //   //     });
  //   //     await userRole(userRoleDTO);
  //   //     setUserRoleDTO("");
  //   //   }
  //   // } else {
  //   //   await userRole(data);
  //   //   setUserRoleDTO("");
  //   return;
  //   // }
  // };
  const grade = async () => {
    const response = await userChannelGrade(channelCode, user.userEmail);
    setUserGrade(response.data);
  };
  const loginGrade = async () => {
    const response = await loginUserChannelGrade(channelCode);
    setloginUserGrade(response.data);
  };
  useEffect(() => {
    if (channelCode !== undefined && channelCode !== null) grade();
  }, [channelCode]);
  useEffect(() => {
    if (channelCode !== undefined && channelCode !== null && token !== null)
      loginGrade();
  }, [channelCode, token]);

  const [banOpen, setbanOpen] = useState(false);

  const gradeChangeSubmit = () => {
    // 여기에 유저 정보 변경 로직
    console.log("채널코드 : " + channelCode);
    console.log(managementDTO);
    // 여기서 정보 보내기
    // 초기화
    setManagementDTO({
      userEmail: user.userEmail,
      managementUserStatus: "",
      channelCode: channelCode,
      banDate: 0,
    });
  };

  return (
    <div className="user-profile-box">
      <div className="user-profile" onClick={userMenuToggle}>
        <img
          className="user-profile-img"
          src={
            user?.userImgUrl !== null
              ? "http://192.168.10.51:8083/user/" +
                user?.userEmail +
                "/" +
                user?.userImgUrl
              : "http://192.168.10.51:8083/e0680940917fba1b2350c6563c32ad0c.jpg"
          }
        />
        <p className="user-profile-nickname">
          {user?.userNickname}
          {time !== undefined && <TimeFormat time={time} />}
        </p>
      </div>
      {isOpenUser && token && loginUser.userEmail !== user?.userEmail && (
        <div className="profile-actions">
          <Link
            state={{
              toUser: {
                email: user.userEmail,
                nickname: user.userNickname,
              },
            }}
            to="/message/write"
          >
            쪽지 보내기
          </Link>
          <a>유저페이지로 이동</a>
          {/* 채널 관리자라면
     
          
          */}
          {loginUserGrade.managementUserStatus == "admin" && <a>차단하기</a>}
          {/* 채널 호스트라면
          <a>관리자로 임명</a>
          */}
          {loginUserGrade.managementUserStatus == "host" && (
            <>
              <a onClick={() => setbanOpen(!banOpen)}>차단하기</a>
              {banOpen &&
                (userGrade === null ||
                  userGrade === "" ||
                  userGrade.managementUserStatus !== "ban") && (
                  <>
                    <div>벤하실건가여?</div>

                    <label>
                      <input
                        type="radio"
                        value={1}
                        onClick={(e) =>
                          setManagementDTO({
                            ...managementDTO,
                            banDate: e.target.value,
                            managementUserStatus: "ban",
                            channelCode: channelCode,
                          })
                        }
                      />
                      1일
                    </label>
                    <label>
                      <input
                        type="radio"
                        value={3}
                        onClick={(e) =>
                          setManagementDTO({
                            ...managementDTO,
                            banDate: e.target.value,
                            managementUserStatus: "ban",
                            channelCode: channelCode,
                          })
                        }
                      />
                      3일
                    </label>
                    <label>
                      <input
                        type="radio"
                        value={7}
                        onClick={(e) =>
                          setManagementDTO({
                            ...managementDTO,
                            banDate: e.target.value,
                            managementUserStatus: "ban",
                            channelCode: channelCode,
                          })
                        }
                      />
                      일주일
                    </label>
                    <label>
                      <input
                        type="radio"
                        value={30}
                        onClick={(e) =>
                          setManagementDTO({
                            ...managementDTO,
                            banDate: e.target.value,
                            managementUserStatus: "ban",
                            channelCode: channelCode,
                          })
                        }
                      />
                      1달
                    </label>
                    <label>
                      <input
                        type="radio"
                        value={365}
                        onClick={(e) =>
                          setManagementDTO({
                            ...managementDTO,
                            banDate: e.target.value,
                            managementUserStatus: "ban",
                            channelCode: channelCode,
                          })
                        }
                      />
                      1년
                    </label>
                    <label>
                      <input
                        type="radio"
                        value={99999}
                        onClick={(e) =>
                          setManagementDTO({
                            ...managementDTO,
                            banDate: e.target.value,
                            managementUserStatus: "ban",
                            channelCode: channelCode,
                          })
                        }
                      />
                      영구
                    </label>
                    <button
                      onClick={() => {
                        gradeChangeSubmit();
                      }}
                    >
                      벤 확인
                    </button>
                  </>
                )}
              {userGrade !== null ||
                (userGrade.managementUserStatus === "ban" && (
                  <>
                    <div>벤풀기</div>
                    <div>남은날짜 : {userGrade.managementUserStatus}</div>
                  </>
                ))}

              <div
                onClick={() => {
                  setManagementDTO({
                    ...managementDTO,
                    managementUserStatus: "admin",
                    channelCode: channelCode,
                  });
                  gradeChangeSubmit();
                }}
              >
                해당 유저관리자로 임명
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
