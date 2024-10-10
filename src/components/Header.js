import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/header.scss";
import Login from "../pages/Login";

const Header = () => {
  const [page, setPage] = useState(false);
  const [token, setToken] = useState();
  const [user, setUser] = useState({
    userEmail: localStorage.getItem("userEmail"),
    userNickname: localStorage.getItem("userNickname"),
    userImgUrl: localStorage.getItem("userImgUrl"),
    userInfo: localStorage.getItem("userInfo"),
    userPoint: localStorage.getItem("userPoint"),
  });
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    console.log("해더 유저");
    setUser({
      userEmail: localStorage.getItem("userEmail"),
      userNickname: localStorage.getItem("userNickname"),
      userImgUrl: localStorage.getItem("userImgUrl"),
      userInfo: localStorage.getItem("userInfo"),
      userPoint: localStorage.getItem("userPoint"),
    });
    console.log(user);
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
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
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
            <div className="user-info">
              <img
                className="user-img"
                src={
                  "http://192.168.10.51:8083/user/" +
                  user.userEmail +
                  "/" +
                  user.userImgUrl
                }
              />
              {user.userNickname}
            </div>
            <Link id="logout-btn" onClick={logout} className="info">
              로그아웃
            </Link>

            <Link to={"/mypage"} id="mypage-btn" className="info">
              마이페이지
            </Link>
          </div>
        )}
      </header>

      {page && (
        <Login onClose={closeLogin} setToken={setToken} setUser={setUser} />
      )}
    </>
  );
};

export default Header;
