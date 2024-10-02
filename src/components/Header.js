import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../assets/header.scss";
import Login from "../pages/Login";
import Btn from "./Btn";

const Header = () => {
  const [page, setPage] = useState(false);
  const [token, setToken] = useState();
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const openPage = () => {
    setPage(true);
  };

  const hidenTogle = () => {
    const div = document.querySelector("#search-hiden");
    div.style = "display: block";
  };

  const closeLogin = () => {
    setPage(false);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
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
          <button className="hiden-btn" onClick={hidenTogle}>
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
          </div>
        )}
      </header>

      {page && <Login onClose={closeLogin} />}
    </>
  );
};

export default Header;
