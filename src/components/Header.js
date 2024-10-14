import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/header.scss";
import Login from "../pages/Login";
import { kakaoLogout } from "../user/kakaoCode";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserInfo } from "../api/user";
const Header = () => {
  const [page, setPage] = useState(false);
  const { user, token } = useAuth();
  const { logout: authLogout } = useAuth();
  const [tokenCk, setTokenCk] = useState(false);

  // const queryClient = useQueryClient();
  // // 댓글 목록
  // const {
  //   data: userDTO,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   // 데이터, 로딩중인지, 에러발생
  //   queryKey: ["userInfo", localStorage.getItem("userEmail")],
  //   queryFn: () => getUserInfo(localStorage.getItem("userEmail")),
  //   refetchInterval: 1000, // 해당 시간마다 데이터갱식하여 실시간 처럼 처리
  // });

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
  useEffect(() => {
    if (token === null) setTokenCk(true);
    else {
      setTokenCk(false);
    }
  }, [token]);
  // if (isLoading) return <>로딩중...</>;

  // 에러 발생시 처리
  // if (error) return <>에러발생...</>;

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
              {user.userImgUrl == null ? (
                <img
                  className="user-img"
                  src="http://192.168.10.51:8083/e0680940917fba1b2350c6563c32ad0c.jpg"
                />
              ) : (
                <img
                  className="user-img"
                  src={
                    "http://192.168.10.51:8083/user/" +
                    user.userEmail +
                    "/" +
                    user.userImgUrl
                  }
                />
              )}
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

      {page && <Login onClose={closeLogin} />}
    </>
  );
};

export default Header;
