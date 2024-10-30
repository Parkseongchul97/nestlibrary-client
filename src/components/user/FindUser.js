import { useQuery } from "@tanstack/react-query";

import { findUser as byNickname } from "../../api/message";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import UserMenu from "../user/UserMenu";
import "../../assets/findUser.scss";
import MessageWrite from "../messages/MessageWrite";
const FindUser = ({
  toNickname,
  inputNickname,
  setInputNickname,
  findSubmit,
  selectedUser,
  viewNickname,
  deleteToUser,
  isOpen,
  setIsOpen,
}) => {
  const { user } = useAuth(); // 발신자(로그인유저)
  const [isComposing, setIsComposing] = useState(false);
  const resultRef = useRef(null); // 창닫기용

  const enterSearchSubmit = (e) => {
    if ((e.code === "Enter" || e.code === "NumpadEnter") && !isComposing) {
      findSubmit();
    }
  };
  const {
    data: findUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["findUser", toNickname],
    queryFn: () => byNickname(toNickname),
    enabled: toNickname.length > 1,
  });
  const handleClickOutside = (event) => {
    if (resultRef.current && !resultRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) return <></>;
  if (error) return <></>;
  return (
    <>
      <div className="find-user-box">
        {viewNickname === "" || viewNickname === undefined ? (
          <div className="find-header">
            <div className="find-header-search">
              <input
                placeholder="수신자 찾기"
                type="text"
                value={inputNickname}
                onChange={(e) => {
                  setInputNickname(e.target.value);
                }}
                onKeyDown={enterSearchSubmit}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
              />
              <button onClick={findSubmit}>찾기</button>
            </div>
          </div>
        ) : (
          <>
            <div className="find-header">
              <p>수신자 : {viewNickname} </p>
              <p className="reset-btn" onClick={deleteToUser}>
                취소
              </p>
            </div>
          </>
        )}
      </div>
      {isOpen && findUser?.data?.length > 0 ? (
        <>
          <div className="find-user-list-box" ref={resultRef}>
            {findUser.data.map(
              (targetUser) =>
                targetUser.userEmail !== user.userEmail && (
                  <div className="find-user-list" key={targetUser.userEmail}>
                    <UserMenu user={targetUser} />
                    <button
                      onClick={() => {
                        selectedUser(targetUser);
                        setIsOpen(false);
                      }}
                    >
                      선택
                    </button>
                  </div>
                )
            )}
          </div>
        </>
      ) : isOpen && findUser?.data?.length === 0 ? (
        <div className="find-user-list-box">
          <p className="result-none">검색 결과가 없습니다.</p>
        </div>
      ) : null}
    </>
  );
};
export default FindUser;
