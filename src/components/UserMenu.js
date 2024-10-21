import React, { useState } from "react";
import TimeFormat from "./TimeFormat";
import "../assets/userMenu.scss";

const UserMenu = ({ user, time }) => {
  const [isOpen, setIsOpen] = useState(false);
  const accordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="user-profile-box">
      <div className="user-profile" onClick={accordion}>
        <img
          className="user-profile-img"
          src={
            user?.userImgUrl != null
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
      {isOpen && (
        <div className="profile-actions">
          <a>쪽지 보내기</a>
          <a>게시글 검색</a>
          <a>유저페이지로 이동</a>
          {/* 채널 관리자라면
          <a>차단하기</a>
          */}
          {/* 채널 호스트라면
          <a>관리자로 임명</a>
          */}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
