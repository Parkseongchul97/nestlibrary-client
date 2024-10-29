import { useQuery } from "@tanstack/react-query";

import { findUser as byNickname } from "../../api/message";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import UserMenu from "../user/UserMenu";
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

  if (isLoading) return <></>;
  if (error) return <></>;
  return (
    <div>
      <input
        placeholder="찾는 사람의 닉네임을 입력해주세요"
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

      {isOpen && findUser?.data?.length > 0 ? (
        findUser.data.map(
          (targetUser) =>
            targetUser.userEmail !== user.userEmail && (
              <div key={targetUser.userEmail}>
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
        )
      ) : isOpen && findUser?.data?.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : null}
      <p>
        수신자 : {viewNickname} <button onClick={deleteToUser}>취소</button>
      </p>
    </div>
  );
};
export default FindUser;
