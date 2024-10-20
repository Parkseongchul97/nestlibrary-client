import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/header.scss";
import Login from "../pages/Login";
import { kakaoLogout } from "../user/kakaoCode";
import { useAuth } from "../contexts/AuthContext";
import { mySub } from "../api/subscribe";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserInfo } from "../api/user";
import UserMenu from "./UserMenu";
import ChannelList from "./ChannelList";
const Header = () => {
  const [page, setPage] = useState(false);
  const { user, token } = useAuth();
  const { logout: authLogout } = useAuth();
  const [subOpen, setSubOpen] = useState();

  const openPage = (event) => {
    setPage(true);
    event.preventDefault();
  };

  const hidenTogle = () => {
    const div = document.querySelector("#search-hidden");
    div.style = "display: block";
  };

  const closeLogin = () => {
    setPage(false);
  };
  const logout = async () => {
    authLogout();
    kakaoLogout();
  };
  const queryClient = useQueryClient();
  const {
    data: subList,// 구독중 리스트
    isLoading: subLoading,
    error: subError,
  } = useQuery({
    queryKey: ["mySubList" ,token],
    queryFn: () => (token ? mySub() : null), // 토큰이 없으면 호출하지 않음
    enabled: !!token,
  });
  if(subLoading) return <>로딩중...</>;
if(subError) return <>에러...</>;

  return (
    <>
      <header className="header">
        <div className="header-left">
          <Link to={"/"}>Nest Library</Link>
        </div>

        <div className="header-center">
          <div className="header-center-menu">
            <div className="channel-menu">구독 채널</div>
            {/* <ChannelList isOpen={subOpen} listTitle={"구독 채널"} subList={subList} /> */}
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

        {token === null ? (
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
            <UserMenu user={user} />

            <Link id="logout-btn" onClick={logout} className="info">
              로그아웃
            </Link>

            <Link to={"/mypage"} id="mypage-btn" className="info">
              마이페이지
            </Link>
          </div>
        )}
      </header>

      {page && <Login onClose={closeLogin} />}
    </>
  );
};

export default Header;
