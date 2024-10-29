import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { findUser as byNickname } from "../api/message";
import "../assets/userManagement.scss";
import { everyRole } from "../api/management.js";
import FindUser from "../components/FindUser";
import { all } from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "../contexts/AuthContext.js";

import "../assets/login.scss";

const UserManagement = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(true);
  const [inputNickname, setInputNickname] = useState(null);
  const [toNickname, setToNickname] = useState(""); //
  const [ban, setBan] = useState(false);
  const [host, setHost] = useState(false);
  const [send, setSent] = useState(false);

  const [managementDTO, setManagementDTO] = useState({
    managementUserStatus: "",
    channelCode: "",
    banDate: "",
    userEmail: "",
  });

  const [selectedUser, setSelectedUser] = useState([]);
  const location = useLocation();
  const [targetUser, setTargetUser] = useState("");
  const channelCode = location.state?.channelCode;
  const {
    data: findUser,
    isLoading,
    errors,
  } = useQuery({
    queryKey: ["findUser", toNickname],
    queryFn: () => byNickname(toNickname),
    enabled: toNickname.length > 1,
  });

  const findSubmit = () => {
    setToNickname(inputNickname);
    setIsOpen(true);
  };
  /*
  const selectedUser = (targetUser) => {
    // 여기서 필요한곳에 타겟 유저.필요한정보 담기
    setViewNickname(targetUser?.userNickname);
  };*/

  const allUser = async (data) => {
    if (inputNickname.trim().length < 1) {
      alert("닉네임을 입력해주세요!");
      return;
    }
    const response = await everyRole(channelCode, data, "");
    setSelectedUser(response);
    setInputNickname("");
  };

  const adminList = async () => {
    const response = await everyRole(channelCode, null, "admin");
    setSelectedUser(response);
    setIsSearch(false);
  };
  const banList = async () => {
    const response = await everyRole(channelCode, null, "ban");
    setSelectedUser(response);
    setIsSearch(false);
  };

  useEffect(() => {
    setBan(false);
    setHost(false);
    if (!isOpen) {
      setManagementDTO({
        managementUserStatus: "",
        channelCode: "",
        banDate: "",
        userEmail: "",
      });
    }
  }, [isOpen]);

  const enter = (e) => {
    console.log(e.key);
    if (e.key === "Enter" && inputNickname != null) {
      allUser(inputNickname);
    }
  };
  const updateInfo = (data) => {
    if (data.userNickname != user.userNickname) {
      setIsOpen(!isOpen);

      setTargetUser(data);
      setManagementDTO({
        userEmail: data.userNickname,
        channelCode: channelCode,
      });
    }
  };

  const gradeChangeSubmit = () => {};
  const handleRadioChange = (e) => {
    setManagementDTO({
      ...managementDTO,
      banDate: e.target.value,
      managementUserStatus: "ban",
    });
  };

  const agree = (data) => {
    setBan(false);
    setHost(false);
    const result = window.confirm(data);
  };

  return (
    <>
      <div className="main-box">
        <div className="management-box">
          <div className="title">유저 관리 페이지 </div>
          <div className="main-content">
            <div className="main-content-left">
              <div
                className="all-user"
                onClick={() => {
                  setIsSearch(true);
                  setSelectedUser([]);
                  setInputNickname("");
                }}
              >
                전체 사용자
              </div>
              <div className="admin-user" onClick={() => adminList()}>
                관리자
              </div>
              <div className="ban-user" onClick={() => banList()}>
                차단리스트
              </div>
            </div>
            <div className="main-content-right">
              <div className="search-form">
                {isSearch && (
                  <>
                    <input
                      className="search-user"
                      placeholder="유저 닉네임"
                      onChange={(e) => setInputNickname(e.target.value)}
                      value={inputNickname}
                      onKeyDown={enter}
                    />
                    <button
                      className="search-submit"
                      onClick={() => allUser(inputNickname)}
                    >
                      검색
                    </button>
                  </>
                )}
              </div>
              <table>
                <thead>
                  <tr>
                    <th>닉네임</th>
                    <th>이메일</th>
                    <th>등급</th>
                    <th>삭제 예정일</th>
                    <th>작성글 수 </th>
                    <th>댓글 수 </th>
                  </tr>
                </thead>

                <tbody>
                  {selectedUser && selectedUser.length > 0 ? (
                    selectedUser.map((users) => (
                      <tr key={users.userEmail}>
                        {" "}
                        {/* 고유 키 추가 */}
                        <td onClick={() => updateInfo(users)}>
                          {users?.userNickname}
                        </td>
                        <td>{users?.userEmail}</td>
                        <td>
                          {users?.managementUserStatus != null
                            ? users?.managementUserStatus
                            : "해당없음"}
                        </td>
                        <td>
                          {users.managementDeleteAt != null
                            ? users.managementDeleteAt.split("T")[0]
                            : "해당없음"}
                        </td>
                        <td>{users.postCount}</td>
                        <td>{users.commentCount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>조회 결과가 없습니다.</td>{" "}
                      {/* 대체 메시지 */}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="login-box">
            <div className="login-header">
              <button className="close" onClick={() => setIsOpen(!isOpen)}>
                <IoIosArrowBack />
              </button>
              <h3>정보 수정</h3>
              <div className="balance"></div>
            </div>
            <div className="login-body">
              <div className="login-form">
                <div className="input-box">
                  <span>닉네임 : {targetUser.userNickname}</span>
                  <span>
                    현재등급 :
                    {targetUser.managementUserStatus != null
                      ? targetUser.managementUserStatus
                      : "해당없음"}
                  </span>
                  {targetUser.managementUserStatus == "ban" && (
                    <span>
                      삭제일 :{targetUser.managementDeleteAt.split("T")[0]}
                    </span>
                  )}
                </div>
                <div className="input-box">
                  <div className="button-type">
                    {targetUser.managementUserStatus == null ? (
                      <>
                        <button onClick={() => setBan(!ban)}>벤</button>
                        <button onClick={() => agree("admin")}>
                          관리자로임명
                        </button>
                      </>
                    ) : targetUser.managementUserStatus == "ban" ? (
                      <>
                        <button
                          onClick={() => {
                            setBan(!ban);
                          }}
                        >
                          벤연장
                        </button>
                        <button onClick={() => agree("banCancle?")}>
                          벤취소
                        </button>
                      </>
                    ) : targetUser.managementUserStatus == "admin" ? (
                      <>
                        <button
                          onClick={() => {
                            setHost(false);
                            setBan(false);
                            agree("관리자 권한을 삭제하시겠습니까?");
                          }}
                        >
                          관리자 취소
                        </button>
                        <button
                          onClick={() => {
                            setHost(!host);
                            setBan(false);
                          }}
                        >
                          호스트로 임명
                        </button>
                        <button
                          onClick={() => {
                            setBan(!ban);
                            setHost(false);
                          }}
                        >
                          벤
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
                {ban && (
                  <>
                    <div className="radio-box">
                      <label>
                        <input
                          type="radio"
                          name={`option-${targetUser?.userEmail}`}
                          value="1"
                          onChange={handleRadioChange}
                        />
                        1일
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`option-${targetUser?.userEmail}`}
                          value="7"
                          onChange={handleRadioChange}
                        />
                        1주일
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`option-${targetUser?.userEmail}`}
                          value="30"
                          onChange={handleRadioChange}
                        />
                        1달
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`option-${targetUser?.userEmail}`}
                          value="365"
                          onChange={handleRadioChange}
                        />
                        1년
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`option-${targetUser?.userEmail}`}
                          value="99999"
                          onChange={handleRadioChange}
                        />
                        영구벤
                      </label>
                    </div>
                    <button onClick={gradeChangeSubmit}>확인</button>
                  </>
                )}
                {host && (
                  <>
                    <div className="email-box">
                      <span>이메일 인증이 필요합니다 </span>
                      <input
                        type="text
                        "
                      />
                    </div>
                    <button onClick={() => setSent(true)}>
                      {send ? "재발송" : "발송"}
                    </button>
                    <button>확인</button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="login-bg" onClick={() => setIsOpen(!isOpen)}></div>
        </>
      )}
    </>
  );
};

export default UserManagement;
