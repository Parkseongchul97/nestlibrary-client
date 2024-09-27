import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../assets/header.scss";
const Header = () => {
  const hidenTogle = () => {
    const div = document.querySelector("#search-hiden");
    div.style = "display: block";
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
        <div className="header-right">
          <Link to={"/login-page"} className="info">
            로그인
          </Link>
          <Link to={"/register"} className="info">
            회원가입
          </Link>
        </div>
      </header>
    </>
  );
};
export default Header;
