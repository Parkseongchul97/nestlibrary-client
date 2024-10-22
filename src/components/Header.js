import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../assets/header.scss";
import Login from "../pages/Login";
import { kakaoLogout } from "../user/kakaoCode";
import { useAuth } from "../contexts/AuthContext";
import UserMenu from "./UserMenu";
import { isOpenMessgeCount } from "../api/message";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const Header = ({ onSearch, onsub, all }) => {
  const [page, setPage] = useState(false);
  const { user, token } = useAuth();
  const { logout: authLogout } = useAuth();
  const [isSearch, setIsSearch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [click, setClick] = useState("");
  const [click1, setClick1] = useState("");
  const searchRef = useRef(null);
  const queryClient = useQueryClient();
  const {
    data: messageCount,
    isLoading,
    error,
  } = useQuery({
    // 데이터, 로딩중인지, 에러발생
    queryKey: ["messageCount"],
    queryFn: () => isOpenMessgeCount(),
    refetchInterval: 1000, // 해당 시간마다 데이터갱식하여 실시간 처럼 처리
    enabled: !!token,
  });

  const openPage = (event) => {
    setPage(true);
    event.preventDefault();
  };

  const hidenTogle = () => {
    /*
    const div = document.querySelector("#search-hidden");
    div.style = "display: block";*/
    setIsSearch(true);
  };

  const closeLogin = () => {
    setPage(false);
  };
  const logout = async () => {
    authLogout();
    kakaoLogout();
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearch(false);
    }
  };

  const enter = (e) => {
    if (e.key === "Enter") {
      onSearch(keyword);
    }
  };

  const subCheck = () => {
    onsub();
    setClick("subs");
    setClick1("");
  };

  const allChannel = () => {
    all();
    setClick1("all");
    setClick("");
  };

  // 검색창 페이징 처리  미완성 10-16 성일
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 700 && keyword.length > 0) {
        // 가로길이 700 이상이 아닐때 => 1~699 = > true ! ,  700 이상이면 false false는 닫힘
        // true false는
        // 숨겨진 검색창을 관리함
        setIsSearch(true);
      } else if (isSearch) {
        setIsSearch(!(window.innerWidth > 700));
      }
    };
    if (isSearch && keyword.length > 0) {
      setIsSearch(true);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isSearch]);
  if (isLoading) return <>로딩중...</>;

  // 에러 발생시 처리
  if (error) return <>에러발생...</>;

  return (
    <>
      <header className="header">
        <div className="header-left">
          <Link to={"/"}>Nest Library</Link>
        </div>

        {!isSearch ? (
          <>
            <div ref={searchRef} className="header-center">
              <div className="header-center-menu">
                <div className="channel-menu" id={click} onClick={subCheck}>
                  구독 채널
                </div>
                <div className="channel-menu" id={click1} onClick={allChannel}>
                  모든 채널
                </div>
              </div>
              <div id="search" className="header-center-search">
                <input
                  className="search"
                  type="text"
                  placeholder="찾기"
                  onChange={(e) => setKeyword(e.target.value)}
                  value={keyword}
                  onKeyDown={enter}
                />
                <button id="channel-search">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    size="1x"
                    onClick={() => onSearch(keyword)}
                  />
                </button>
              </div>
              <button className="hidden-btn" onClick={hidenTogle}>
                <FontAwesomeIcon icon={faMagnifyingGlass} size="1x" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div ref={searchRef} className="header-center">
              <div id="hidden-search" className="header-center-search">
                <input
                  className="search"
                  type="text"
                  placeholder="찾기"
                  onChange={(e) => setKeyword(e.target.value)}
                  value={keyword}
                  onKeyDown={enter}
                />
                <button id="channel-search" onClick={() => onSearch(keyword)}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} size="1x" />
                </button>
              </div>
            </div>
          </>
        )}

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
            {messageCount !== undefined && (
              <Link to="/messages" id="message-count">
                안읽은 메시지({messageCount.data})
              </Link>
            )}
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
