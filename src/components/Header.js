import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../assets/header.scss";
const Header = () => {
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
            <FontAwesomeIcon icon={faMagnifyingGlass} size="1x" />
            <input className="search" type="text" placeholder="찾기" />
          </div>
        </div>
        <div className="header-right">
          <a href="/login-page" className="info">
            로그인
          </a>
          <a href="/register-page" className="info">
            회원가입
          </a>
        </div>
      </header>
    </>
  );
};
export default Header;
