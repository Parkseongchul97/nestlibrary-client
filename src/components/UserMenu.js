import React, { useEffect, useState } from "react";
import TimeFormat from "./TimeFormat";
import "../assets/userMenu.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { userRole } from "../api/management";

const UserMenu = ({
  user,
  channelCode,
  time,
  isOpenUser,
  userMenuToggle,
  role,
}) => {
  const [userRoleDTO, setUserRoleDTO] = useState({
    userEmail: user.userEmail,
    managementUserStatus: "",
    channelCode: "",
    banDate: "",
  });

  const handleRadioChange = (e) => {
    setUserRoleDTO({
      ...userRoleDTO,
      banDate: e.target.value,
      managementUserStatus: "ban",
      channelCode: role?.channel.channelCode,
    });
  };

  const handleConfirm = () => {
    // 보내고

    getUserDTo();
    // 닫고
    userMenuToggle();
    // 초기화
    setUserRoleDTO({
      userEmail: user.userEmail,
      banDate: "",
      managementUserStatus: "",
      channelCode: "",
    });
  };

  const { user: loginUser, token } = useAuth();

  const getUserDTo = async () => {
    console.log("벤");
    console.log(userRoleDTO);
    await userRole(userRoleDTO);
  };
  const grade = () => {};

  const getAdmin = async (data) => {
    console.log("관리자");
    console.log(data);
    await userRole(data);
  };

  useEffect(() => {
    setUserRoleDTO({
      ...userRoleDTO,
      banDate: "",
      managementUserStatus: "",
      channelCode: "",
    });
  }, [isOpenUser]);

  const [banOpen, setbanOpen] = useState(false);

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
          {role.managementUserStatus == "admin" && <a>차단하기</a>}
          {/* 채널 호스트라면
          <a>관리자로 임명</a>
          */}
          {role.managementUserStatus == "host" && (
            <>
              <a onClick={() => setbanOpen(!banOpen)}>차단하기</a>
              {banOpen && (
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
                    onClick={handleConfirm}
                    disabled={userRoleDTO.banDate > 0 ? false : true}
                  >
                    확인
                  </button>
                </>
              )}
              <a
                onClick={() =>
                  getAdmin({
                    userEmail: user.userEmail,
                    banDate: "",
                    managementUserStatus: "admin",
                    channelCode: role?.channel.channelCode,
                  })
                }
              >
                관리자로 임명
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
