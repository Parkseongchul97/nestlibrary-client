import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import PostManagement from "../components/post/PostManagement.js";

import "../assets/userManagement.scss";
import {
  everyRole,
  addRole,
  removeRole,
  loginUserChannelGrade,
  allPost,
} from "../api/management.js";

import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "../contexts/AuthContext.js";
import { sendCode, checkEmail } from "../api/email.js";
import { getPageNum } from "../api/post.js";
import { Link } from "react-router-dom";

import "../assets/login.scss";

const UserManagement = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(true);
  const [inputNickname, setInputNickname] = useState(null);
  const [page, setPage] = useState(1);

  const [ban, setBan] = useState(false);
  const [host, setHost] = useState(false);
  const [send, setSent] = useState(false);
  const [emailCode, setEmailCode] = useState("");

  const [loginDto, setLoginDto] = useState("");

  const [managementDTO, setManagementDTO] = useState({
    managementUserStatus: "",
    channelCode: "",
    banDate: "",
    userEmail: "",
  });

  const [selectedUser, setSelectedUser] = useState([]);
  const location = useLocation();
  const [targetUser, setTargetUser] = useState("");
  const [post, setPost] = useState([]);
  const [isPost, setIsPost] = useState(false);
  const [author, setAuthor] = useState(null);
  const channelCode = location.state?.channelCode;
  const [check, setCheck] = useState([]);

  const allUser = async (data) => {
    if (inputNickname.trim().length < 1) {
      alert("닉네임을 입력해주세요!");
      return;
    }
    const response = await everyRole(channelCode, data, "");
    setSelectedUser(response);
    setInputNickname("");
  };

  // 관리자 리스트
  const adminList = async () => {
    const response = await everyRole(channelCode, null, "admin");
    setSelectedUser(response);
    setIsSearch(false);
  };
  // 차단리스트
  const banList = async () => {
    const response = await everyRole(channelCode, null, "ban");
    setSelectedUser(response);
    setIsSearch(false);
  };

  // 이메일 발송
  const goEmail = async (data) => {
    const response = await sendCode(data);
    alert("이메일로 인증번호가 발송되었습니다!");
  };
  // 인증코드 확인
  const codeCheck = async (data) => {
    const response = await checkEmail(emailCode);
    let result = null;
    if (response.data) {
      result = window.confirm("정말 호스트를 양도하시겠습니까?");
      if (result) {
        addRole(data);
        alert("양도 되었습니다");
        adminList();
        setIsOpen(false);
      } else {
        alert("취소되었습니다");
      }
    } else {
      alert("인증번호가 일치하지 않습니다");
    }
  };

  const loginUser = async () => {
    const response = await loginUserChannelGrade(channelCode);
    setLoginDto(response.data);
  };

  useEffect(() => {
    loginUser();
  }, [isOpen]);

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

  const postEnter = (e) => {
    console.log(e.key);
    if (e.key === "Enter" && author != null) {
      postList(author);
    }
  };

  const updateInfo = (data) => {
    if (
      data.userNickname !== user.userNickname &&
      data.managementUserStatus !== "host"
    ) {
      setIsOpen(!isOpen);

      setTargetUser(data);
      setManagementDTO({
        userEmail: data.userEmail,
        channelCode: channelCode,
      });
    }
  };

  const gradeChangeSubmit = async (data) => {
    let result = null;
    if (data.managementUserStatus === "admin") {
      result = window.confirm("정말 관리자로 임명하시겠습니까?");
      if (result) {
        await addRole(data);
        adminList();
        alert("관리자가 추가 되었습니다");
        setIsOpen(false);
        return;
      } else {
        alert("취소되었습니따");
        return;
      }
    }

    if (managementDTO.managementUserStatus === "ban") {
      await addRole(managementDTO);
      setIsOpen(false);
      banList();
      return;
    }
  };
  const handleRadioChange = (e) => {
    setManagementDTO({
      ...managementDTO,
      banDate: e.target.value,
      managementUserStatus: "ban",
    });
  };

  const cancle = async (code) => {
    await removeRole(code);
  };

  const agree = (data) => {
    // 값에 따라서 추가 or 삭제 + 메시지 까지
    setBan(false);
    setHost(false);
    let result = null;
    if (data.managementUserStatus === "ban") {
      result = window.confirm("벤을 취소 하시겠습니까? ");
      if (result) {
        cancle(data.managementCode);
        alert("완료되었습니다");
        banList();
        setIsOpen(false);
      } else {
        alert("취소되었습니다");
      }
    } else if (data.managementUserStatus === "admin") {
      result = window.confirm("관리자 권한을 취소 하시겠습니까? ? ");
      if (result) {
        cancle(data.managementCode);
        alert("완료되었습니다");
        adminList();
        setIsOpen(false);
      } else {
        alert("취소되었습니다");
      }
    }
  };
  // 게시글 조회
  const postList = async (author) => {
    const response = await allPost(channelCode, author);
    setPost(response);
  };

  const getPage = async (code) => {
    const response = await getPageNum(code);
    setPage(response.data);
    return response.data;
  };

  useEffect(() => {
    {
      post.map((post) => getPage(post.postCode));
    }
  }, [isOpen]);
  useEffect(() => {
    console.log(check);
  }, [check]);

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
                  setIsPost(false);
                }}
              >
                전체 사용자
              </div>
              <div
                className="admin-user"
                onClick={() => {
                  adminList();
                  setIsPost(false);
                }}
              >
                관리자
              </div>
              <div
                className="ban-user"
                onClick={() => {
                  banList();
                  setIsPost(false);
                }}
              >
                차단리스트
              </div>

              <div
                className="admin-user"
                onClick={() => {
                  postList();
                  setIsPost(true);
                  setIsSearch(false);
                }}
              >
                게시글
              </div>
            </div>
            <div className="main-content-right">
              <div className="search-form">
                {isSearch ? (
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
                ) : isPost ? (
                  <>
                    <input
                      className="search-user"
                      placeholder="글쓴이 검색"
                      onChange={(e) => setAuthor(e.target.value)}
                      value={author}
                      onKeyDown={postEnter}
                    />
                    <button
                      className="search-submit"
                      onClick={() => postList(author)}
                    >
                      검색
                    </button>
                  </>
                ) : null}
              </div>
              {isPost ? (
                <table>
                  <thead>
                    <tr>
                      <th>삭제</th>
                      <th>닉네임</th>
                      <th>이메일</th>
                      <th>게시판</th>
                      <th>제목</th>
                      <th>작성일</th>
                      <th>조회 수 </th>
                      <th>댓글 수 </th>
                    </tr>
                  </thead>

                  <tbody>
                    {post && post.length > 0 ? (
                      post.map((post) => (
                        <PostManagement
                          channelCode={channelCode}
                          post={post}
                          setCheck={setCheck}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>조회 결과가 없습니다.</td>{" "}
                        {/* 대체 메시지 */}
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
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
              )}
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
                    {targetUser.managementUserStatus !== null
                      ? targetUser.managementUserStatus
                      : "해당없음"}
                  </span>
                  {targetUser.managementUserStatus === "ban" && (
                    <span>
                      삭제일 :{targetUser.managementDeleteAt.split("T")[0]}
                    </span>
                  )}
                </div>
                <div className="input-box">
                  <div className="button-type">
                    {targetUser.managementUserStatus === null ? (
                      <>
                        <button onClick={() => setBan(!ban)}>벤</button>
                        {loginDto.managementUserStatus === "host" && (
                          <button
                            onClick={() =>
                              gradeChangeSubmit({
                                userEmail: targetUser.userEmail,
                                managementUserStatus: "admin",
                                channelCode: channelCode,
                                banDate: 0,
                              })
                            }
                          >
                            관리자로임명
                          </button>
                        )}
                      </>
                    ) : targetUser.managementUserStatus === "ban" ? (
                      <>
                        <button
                          onClick={() => {
                            setBan(!ban);
                          }}
                        >
                          벤연장
                        </button>
                        <button onClick={() => agree(targetUser)}>
                          벤취소
                        </button>
                      </>
                    ) : targetUser.managementUserStatus === "admin" &&
                      loginDto.managementUserStatus === "host" ? (
                      <>
                        <button
                          onClick={() => {
                            setHost(false);
                            setBan(false);
                            agree(targetUser);
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
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => {
                        setSent(true);
                        goEmail(user.userEmail);
                      }}
                    >
                      {send ? "재발송" : "발송"}
                    </button>
                    <button
                      onClick={() =>
                        codeCheck({
                          userEmail: targetUser.userEmail,
                          managementUserStatus: "host",
                          channelCode: channelCode,
                          banDate: 0,
                        })
                      }
                    >
                      확인
                    </button>
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
