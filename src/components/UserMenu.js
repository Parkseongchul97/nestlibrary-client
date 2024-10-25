import React, { useEffect, useState } from "react";
import TimeFormat from "./TimeFormat";
import "../assets/userMenu.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { userRole, addRole, removeRole } from "../api/management";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { loginUserChannelGrade, userChannelGrade } from "../api/management";

const UserMenu = ({ user, channelCode, time, isOpenUser, userMenuToggle }) => {
  const [managementDTO, setManagementDTO] = useState({
    userEmail: user.userEmail,
    managementUserStatus: "",
    channelCode: "",
    banDate: 0,
  });

  const handleRadioChange = (e) => {
    setManagementDTO({
      ...managementDTO,
      banDate: e.target.value,
      managementUserStatus: "ban",
      channelCode: loginUserGrade?.channel.channelCode,
    });
  };

  const { user: loginUser, token } = useAuth();

  const [loginUserGrade, setloginUserGrade] = useState(null); // 로그인유저

  const queryClient = useQueryClient();

  const {
    data: userGrade,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["gradeCheck", channelCode, user.userEmail],
    queryFn: () => userChannelGrade(channelCode, user.userEmail),
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
    console.log(userGrade?.data?.managementCode);
    removeRoleMutatoin.mutate(userGrade?.data?.managementCode);
    userMenuToggle();

    queryClient.invalidateQueries(["gradeCheck", channelCode, user.userEmail]);
  };

  useEffect(() => {
    setbanOpen(false);
    setManagementDTO({
      ...managementDTO,
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
        user.userEmail,
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

  if (isLoading) return <>로딩중</>;
  if (error) return <>에러;;</>;
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
          {user?.userNickname},
          {userGrade?.data !== undefined &&
            userGrade?.data?.managementUserStatus}
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

          {loginUserGrade.managementUserStatus == "host" && (
            <>
              {userGrade?.data?.managementUserStatus !== "ban" ? (
                <a onClick={() => setbanOpen(!banOpen)}>차단하기</a>
              ) : (
                <a onClick={() => setbanOpen(!banOpen)}>벤풀기</a>
              )}
              {banOpen && userGrade?.data?.managementUserStatus !== "ban" && (
                <>
                  <div>벤하실건가여?</div>
                  <label>
                    <input
                      type="radio"
                      name={`option-${user?.userEmail}`}
                      value="1"
                      onChange={handleRadioChange}
                    />
                    1일
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`option-${user?.userEmail}`}
                      value="7"
                      onChange={handleRadioChange}
                    />
                    1주일
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`option-${user?.userEmail}`}
                      value="30"
                      onChange={handleRadioChange}
                    />
                    1달
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`option-${user?.userEmail}`}
                      value="365"
                      onChange={handleRadioChange}
                    />
                    1년
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`option-${user?.userEmail}`}
                      value="99999"
                      onChange={handleRadioChange}
                    />
                    영구벤
                  </label>
                  <button
                    onClick={gradeChangeSubmit}
                    disabled={managementDTO.banDate > 0 ? false : true}
                  >
                    확인
                  </button>
                </>
              )}
              {banOpen && userGrade?.data?.managementUserStatus === "ban" && (
                <>
                  <div>{userGrade?.data?.managementDeleteAt}</div>
                  <button onClick={banCanle}>벤 풀기</button>
                </>
              )}
              {userGrade?.data?.managementUserStatus != "admin" &&
                userGrade?.data?.managementUserStatus != "ban" && (
                  <a
                    onClick={() => {
                      gradeChangeSubmit({
                        userEmail: user.userEmail,
                        banDate: "",
                        managementUserStatus: "admin",
                        channelCode: loginUserGrade?.channel.channelCode,
                      });
                    }}
                  >
                    관리자로임명{" "}
                  </a>
                )}

              {userGrade?.data?.managementUserStatus == "admin" && (
                <a onClick={banCanle}>관리자 취소</a>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
