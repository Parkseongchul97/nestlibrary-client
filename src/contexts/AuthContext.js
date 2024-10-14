/*
    Context : 문맥 리액트에서 같은 문맥 아래에 있는 컴포넌트 그룹에 데이터를 공급하는 기능
        Context를 이용하면 props를 전달하지 않고도 컴포넌트 전역에 데이터를 공급할 수 있다.
    ContextAPI : Context를 만들고 다루는 리액트 기능
*/
import { createContext, useState, useContext, useEffect } from "react";

// 1. 새로운 Context 생성
const AuthContext = createContext();

export const AuthPorvider = ({ children }) => {
  // 로그인 상태 <- 토큰 유무로 관리
  const [token, setToken] = useState(localStorage.getItem("token"));

  const userInfo = localStorage.getItem("userInfo");
  const userImgUrl = localStorage.getItem("userImgUrl");
  const [user, setUser] = useState({
    userEmail: localStorage.getItem("userEmail"),
    userNickname: localStorage.getItem("userNickname"),
    userImgUrl: userImgUrl,
    userInfo: userInfo,
    userPoint: localStorage.getItem("userPoint"),
  });

  // 로그인 기능
  const login = (data) => {
    if (token === null) {
      localStorage.setItem("token", data.token);
    }
    localStorage.setItem("userEmail", data.userEmail);
    localStorage.setItem("userNickname", data.userNickname);
    if (data.userImgUrl !== null)
      localStorage.setItem("userImgUrl", data.userImgUrl);
    if (data.userInfo !== null) localStorage.setItem("userInfo", data.userInfo);
    localStorage.setItem("userPoint", data.userPoint);
    setToken(data.token);
    setUser({
      userEmail: data.userEmail,
      userNickname: data.userNickname,
      userImgUrl: data.userImgUrl,
      userInfo: data.userInfo,
      userPoint: data.userPoint,
    });
  };

  // 로그아웃 기능
  const logout = (changeCheck) => {
    localStorage.removeItem("userEmail");
    if (userInfo != undefined) localStorage.removeItem("userInfo");
    if (userImgUrl != undefined) localStorage.removeItem("userImgUrl");
    localStorage.removeItem("userNickname");
    localStorage.removeItem("userPoint");
    if (!changeCheck) {
      console.log("토큰날리는 상황");
      localStorage.removeItem("token");
      setToken(null);
    }
    setUser(null);
  };

  return (
    // 벨류로 등록
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Context의 상태와 기능을 쉽게 사용할 수 있도록 커스텀 훅 만들기
export const useAuth = () => useContext(AuthContext);
