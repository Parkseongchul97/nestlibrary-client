import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/header.scss";
import Login from "../pages/Login";
import { userInfo } from "../api/user";
import { kakaoLogout } from "../user/kakaoCode";

const Header = () => {
  const [member, setMember] = useState({
    userEmail: "",
    userImgUrl: "",
    userInfo: null,
    userNickname: "",
    userPassword: null,
    userPoint: 0,
  });
  const [page, setPage] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setMember({
      userEmail: localStorage.getItem("email"),
      userImgUrl: localStorage.getItem("img"),
      userNickname: localStorage.getItem("nickname"),
    });
  }, []);

  const openPage = () => {
    setPage(true);
  };

  const hidenTogle = () => {
    const div = document.querySelector("#search-hidden");
    div.style = "display: block";
  };

  const closeLogin = () => {
    setPage(false);
  };
  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("img");
    localStorage.removeItem("nickname");
    setMember({
      userEmail: "",
      userImgUrl: "",
      userNickname: "",
    });
    setToken(null);
    kakaoLogout();
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <Link to={"/"}>Nest Library</Link>
        </div>

        <div className="header-center">
          <div className="header-center-menu">
            <div className="channel-menu">구독 채널</div>
            <div className="channel-menu">모든 채널</div>
          </div>
          <div className="header-center-search">
            <input className="search" type="text" placeholder="찾기" />
            <button id="channel-search">
              <FontAwesomeIcon icon={faMagnifyingGlass} size="1x" />
            </button>
          </div>
          <button className="hidden-btn" onClick={hidenTogle}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="1x" />
          </button>
        </div>

        {token == null ? (
          <div className="header-right">
            <Link id="login-btn" onClick={openPage} className="info">
              로그인
            </Link>
            <Link to={"/register"} className="info">
              회원가입
            </Link>
          </div>
        ) : (
          <div className="header-right">
            <Link id="logout-btn" onClick={logout} className="info">
              로그아웃
            </Link>
            <Link to={"/mypage"} id="mypage-btn" className="info">
              마이페이지
            </Link>
            <p>{member.userNickname}</p>
          </div>
        )}
      </header>

      {page && <Login onClose={closeLogin} setToken={setToken} />}
    </>
  );
};

export default Header;
