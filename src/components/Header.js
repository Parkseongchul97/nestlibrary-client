import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../assets/header.scss";
import Login from "../pages/Login";
import { kakaoLogout } from "../user/kakaoCode";
import { useAuth } from "../contexts/AuthContext";
import UserMenu from "../components/user/UserMenu";
import SubChannelList from "./SubChannelList";
import { IoIosMail } from "react-icons/io";
import { TbMessageCircleExclamation } from "react-icons/tb";

import { isOpenMessgeCount } from "../api/message";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { findPush, removeAllPush } from "../api/push";
import PushList from "./PushList";
import { FaBell } from "react-icons/fa";
const Header = ({ onSearch }) => {
  const [page, setPage] = useState(false);
  const { user, token } = useAuth();
  const { logout: authLogout } = useAuth();
  const [isSearch, setIsSearch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [click, setClick] = useState(false);
  const [isPush, setIsPush] = useState(false);
  const searchRef = useRef(null);
  const subChannelRef = useRef(null);
  const subChannelListRef = useRef(null);
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
  const {
    data: pushCount,
    isLoading: pushLoading,
    error: pushError,
  } = useQuery({
    // 데이터, 로딩중인지, 에러발생
    queryKey: ["pushCount"],
    queryFn: () => findPush(),
    refetchInterval: 1000, // 해당 시간마다 데이터갱식하여 실시간 처럼 처리
    enabled: !!token,
  });
  const removeAllMutation = useMutation({
    mutationFn: removeAllPush,
    enabled: !!token,
    onSuccess: () => {
      queryClient.invalidateQueries(["pushCount"]);
    },
  });
  const removeAllSubmit = () => {
    removeAllMutation.mutate();
  };

  const openPage = (event) => {
    setPage(true);
    event.preventDefault();
  };

  const closeLogin = () => {
    setPage(false);
  };
  const logout = async () => {
    authLogout();
    kakaoLogout();
  };

  const handleClickOutside = (event) => {
    if (
      subChannelRef.current && // 구독목록 div가 있고 클릭 요소가
      !subChannelRef.current.contains(event.target) &&
      subChannelListRef.current &&
      !subChannelListRef.current.contains(event.target)
    ) {
      setClick(false);
    }
  };

  const enter = (e) => {
    if (e.key === "Enter") {
      onSearch(keyword);
    }
  };

  // 검색창 페이징 처리  미완성 10-16 성일
  useEffect(() => {
    if (isSearch && keyword.length > 0) {
      setIsSearch(true);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearch]);
  if (isLoading) return <>로딩중...</>;
  if (pushLoading) return <>로딩중...</>;
  // 에러 발생시 처리
  if (error) return <>에러발생...</>;

  // 에러 발생시 처리
  if (pushError) return <>에러발생...</>;

  return (
    <div className="header-contariner">
      <header className="header">
        <div className="header-left">
          <div className="logo" onClick={() => (window.location.href = "/")}>
            Nest Library
          </div>
          <div>
            <div
              className="channel-menu"
              onClick={() => setClick(!click)}
              ref={subChannelRef}
            >
              구독 채널
            </div>
            {click && (
              <div ref={subChannelListRef}>
                <SubChannelList onClose={setClick} />
              </div>
            )}
          </div>
        </div>

        <div ref={searchRef} className="header-right">
          <div id="search" className="header-right-search">
            <input
              className="search-input"
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

          {token === null ? (
            <div className="header-right-none-user">
              <Link id="login-btn" onClick={openPage} className="info">
                로그인
              </Link>

              <Link to={"/register"} className="info">
                회원가입
              </Link>
            </div>
          ) : (
            <div className="header-right-user">
              {isPush && (
                <div className="push-list-box">
                  {pushCount.data.map((push) => (
                    <PushList push={push} key={push?.pushCode} />
                  ))}
                  {pushCount.data !== undefined &&
                    pushCount.data.length !== 0 && (
                      <div
                        className="push-box-remove"
                        onClick={removeAllSubmit}
                      >
                        모두끄기
                      </div>
                    )}
                </div>
              )}
              <UserMenu user={user} />

              <Link id="logout-btn" onClick={logout} className="info">
                로그아웃
              </Link>

              <Link to={"/mypage"} id="mypage-btn" className="info">
                마이페이지
              </Link>
              {messageCount !== undefined &&
                (messageCount.data === 0 ? (
                  <Link to="/messages" id="message-count">
                    <IoIosMail size={"2rem"} />
                  </Link>
                ) : (
                  <Link to="/messages" id="message-count-red">
                    <TbMessageCircleExclamation size={"2.5rem"} />
                    <span>{messageCount.data}</span>
                  </Link>
                ))}

              <div
                className="header-right-push-list"
                onClick={() => setIsPush(!isPush)}
              >
                {pushCount.data === undefined || pushCount.data.length === 0 ? (
                  <FaBell size={"2rem"} style={{ color: "white" }} />
                ) : (
                  <>
                    <FaBell size={"2rem"} style={{ color: "red" }} />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {page && <Login onClose={closeLogin} />}
    </div>
  );
};

export default Header;
