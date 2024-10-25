import React, { useEffect, useState } from "react";
import TimeFormat from "./TimeFormat";
import "../assets/userMenu.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { userRole } from "../api/subscribe";

const UserMenu = ({
  user,
  time,
  noneMenu,
  role,
  setIsOpenUser,
  isOpenUser,
  toggle,
  opening,
}) => {
  const { user: loginUser, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  //const [isOpenUser, setIsOpenUser] = useState(false);
  const [userRoleDTO, setUserRoleDTO] = useState({
    userEmail: "",
    managementUserStatus: "",
    channelCode: "",
    banDate: "",
  });

  const accordion = (userEmail) => {
    setUserRoleDTO({
      channelCode: role.channel.channelCode,
    });
  };
const UserMenu = ({ user, time, isOpenUser, userMenuToggle }) => {
  const { user: loginUser, token } = useAuth();

  const getUserDTo = async (data) => {
    console.log(data);
    if (data.type == "click") {
      if (userRoleDTO.banDate === "") {
        alert("기간 선택을 해주세요!");
        return;
      } else {
        setUserRoleDTO({
          ...userRoleDTO,
          managementUserStatus: "ban",
          userEmail: user.userEmail,
        });
        await userRole(userRoleDTO);
        setUserRoleDTO("");
        setIsOpen(false);
      }
    } else {
      await userRole(data);
      setUserRoleDTO("");
      setIsOpen(false);
      return;
    }
  };

  const [banOpen, setbanOpen] = useState(false);
  // useEffect(() => {
  //   setUserRoleDTO({
  //     userEmail: "",
  //     managementUserStatus: "",
  //     channelCode: "",
  //     banDate: "",
  //   });
  // }, [isOpen]);

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
      {!noneMenu &&
        opening &&
        token &&
        loginUser.userEmail !== user?.userEmail && (
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
          <a>차단하기</a>
          
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
                        onClick={(e) =>
                          setUserRoleDTO({
                            ...userRoleDTO,
                            banDate: e.target.value,
                          })
                        }
                      />
                      1일
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`option-${user?.userEmail}`}
                        value="7"
                        onClick={(e) =>
                          setUserRoleDTO({
                            ...userRoleDTO,
                            banDate: e.target.value,
                          })
                        }
                      />
                      1주일
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`option-${user?.userEmail}`}
                        value="30"
                        onClick={(e) =>
                          setUserRoleDTO({
                            ...userRoleDTO,
                            banDate: e.target.value,
                          })
                        }
                      />
                      1달
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`option-${user?.userEmail}`}
                        value="365"
                        onClick={(e) =>
                          setUserRoleDTO({
                            ...userRoleDTO,
                            banDate: e.target.value,
                          })
                        }
                      />
                      1년
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`option-${user?.userEmail}`}
                        value="99999"
                        onClick={(e) =>
                          setUserRoleDTO({
                            ...userRoleDTO,
                            banDate: e.target.value,
                          })
                        }
                      />
                      영구벤
                    </label>
                    <button onClick={getUserDTo}>확인</button>
                  </>
                )}
                <a
                  onClick={() =>
                    getUserDTo({
                      ...userRoleDTO,
                      managementUserStatus: "admin",
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
