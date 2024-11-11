import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import PostManagement from "../post/PostManagement.js";
import CountdownTimer from "./Timer.js";

import "../../assets/userManagement.scss";
import {
  everyRole,
  addRole,
  removeRole,
  loginUserChannelGrade,
  allPost,
} from "../../api/management.js";

import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "../../contexts/AuthContext.js";
import { sendCode, checkEmail } from "../../api/email.js";

import { remove } from "../../api/post.js";

import "../../assets/login.scss";
import Timer from "./Timer.js";

const UserManagement = ({ channelCode }) => {
  const { user } = useAuth();
  const [resend, setResend] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(true);
  const [inputNickname, setInputNickname] = useState("");
  const [title, setTitle] = useState("전체 사용자");

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

  const [targetUser, setTargetUser] = useState("");
  const [post, setPost] = useState([]);
  const [isPost, setIsPost] = useState(false);
  const [author, setAuthor] = useState("");

  const [checkArray, setCheckArray] = useState([]);

  const removePost = async () => {
    let asd = checkArray.length;
    if (checkArray.length < 1) {
      await remove(checkArray[0]);
      alert("게시글 삭제 완료");
    } else {
      for (let i = 0; i < checkArray.length; i++) {
        await remove(checkArray[i]);
      }
      alert("게시글 " + asd + "개 삭제완료");
    }
    if (author.trim().length > 1) {
      postList(author);
    } else {
      allPostList();
    }
  };

  const allCheck = () => {
    if (checkArray.length == post.length) {
      setCheckArray([]);
    } else {
      setCheckArray([]);
      post.map((posts) => setCheckArray((prev) => [...prev, posts.postCode]));
    }
  };

  const addList = (code) => {
    const numCode = Number(code); // 문자열을 숫자로 변환
    setCheckArray((prev) => {
      if (prev.includes(numCode)) {
        return prev.filter((item) => item !== numCode); // 기존 값 제거
      } else {
        return [...prev, numCode]; // 새 값 추가
      }
    });
  };

  useEffect(() => {}, [checkArray]);

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
    //alert("이메일로 인증번호가 발송되었습니다!");
  };
  // 인증코드 확인
  const codeCheck = async (data) => {
    console.log(typeof Number(emailCode));

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
    if (!isOpen) {
      setSent(false);
      setEmailCode("");
      setSecondsLeft(0);
    }
    if (ban) {
      setSent(false);
      setEmailCode("");
      setSecondsLeft(0);
    }
  }, [isOpen, ban]);

  useEffect(() => {
    if (!host) {
      setSent(false);
      setEmailCode("");
      setSecondsLeft(0);
    }
  }, [host]);
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
    if (e.key === "Enter") {
      allUser(inputNickname);
    }
  };

  const postEnter = (e) => {
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
        setTitle("관리자");
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
      setTitle("차단리스트");
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
  // 닉네임으로 게시글 조회
  const postList = async (data) => {
    if (data.trim().length < 1) {
      alert("닉네임을 입력해주세요!");
    } else {
      const response = await allPost(channelCode, data);
      setCheckArray([]);
      setPost(response);
    }
  };
  // 모든 포스트 조회
  const allPostList = async () => {
    const response = await allPost(channelCode);
    setCheckArray([]);
    setPost(response);
  };

  useEffect(() => {
    console.log(typeof Number(emailCode));
  }, [emailCode]);

  return (
    <>
      <div className="management-container">
        <div className="management-box">
          <div className="title">{title}</div>
          <div className="main-content">
            <div className="main-content-left">
              <div className="left-content-option">
                <div
                  className={
                    title === "전체 사용자"
                      ? "selected-management-user"
                      : "management-user"
                  }
                  onClick={() => {
                    setIsSearch(true);
                    setSelectedUser([]);
                    setInputNickname("");
                    setIsPost(false);
                    setTitle("전체 사용자");
                  }}
                >
                  전체 사용자
                </div>
                <div
                  className={
                    title === "관리자"
                      ? "selected-management-user"
                      : "management-user"
                  }
                  onClick={() => {
                    adminList();
                    setIsPost(false);
                    setTitle("관리자");
                  }}
                >
                  관리자
                </div>
                <div
                  className={
                    title === "차단리스트"
                      ? "selected-management-user"
                      : "management-user"
                  }
                  onClick={() => {
                    banList();
                    setIsPost(false);
                    setTitle("차단리스트");
                  }}
                >
                  차단리스트
                </div>

                <div
                  className={
                    title === "게시글"
                      ? "selected-management-user"
                      : "management-user"
                  }
                  onClick={() => {
                    allPostList();
                    setIsPost(true);
                    setIsSearch(false);
                    setTitle("게시글");
                  }}
                >
                  게시글
                </div>
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
                      <FontAwesomeIcon icon={faMagnifyingGlass} size="1x" />
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
                      <FontAwesomeIcon icon={faMagnifyingGlass} size="1x" />
                    </button>
                  </>
                ) : null}
              </div>
              {isPost ? (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th className="custom-th">
                          <input
                            type="checkbox"
                            checked={
                              checkArray.length === post.length &&
                              post.length > 0
                            }
                            onChange={() => allCheck()}
                          />
                        </th>
                        <th className="custom-nickname">닉네임</th>

                        <th className="custom-tag">게시판</th>
                        <th>제목</th>
                        <th className="custom-time">작성일</th>
                        <th className="custom-view">조회 수</th>
                        <th className="custom-comment">댓글 수</th>
                      </tr>
                    </thead>

                    <tbody>
                      {post && post.length > 0 ? (
                        post.map((post) => (
                          <PostManagement
                            key={post?.postCode}
                            channelCode={channelCode}
                            post={post}
                            addList={addList}
                            checkArray={checkArray}
                          />
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7}>조회 결과가 없습니다.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>닉네임</th>
                      <th>등급</th>
                      <th>삭제 예정일</th>
                      <th>작성글 수</th>
                      <th>댓글 수</th>
                    </tr>
                  </thead>

                  <tbody className="management-link">
                    {selectedUser && selectedUser.length > 0 ? (
                      selectedUser.map((users) => (
                        <tr
                          key={users.userEmail}
                          onClick={() => updateInfo(users)}
                        >
                          <td>{users?.userNickname}</td>

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
                        <td colSpan={5}>조회 결과가 없습니다.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        {isPost && (
          <div className="channel-update-footer">
            {
              <button
                className="deleteTh"
                onClick={() => removePost()}
                disabled={checkArray.length === 0}
              >
                삭제
              </button>
            }
          </div>
        )}
      </div>

      {isOpen && (
        <>
          <div className="management-modal-box">
            <div className="management-modal-header">
              <button className="close" onClick={() => setIsOpen(!isOpen)}>
                <IoIosArrowBack />
              </button>
              <h3>정보 수정</h3>
              <div className="balance"></div>
            </div>
            <div className="management-modal-body">
              <div className="management-modal-form">
                <div className="input-box">
                  <span>닉네임 : {targetUser.userNickname}</span>
                  <span>
                    권한 :
                    {targetUser.managementUserStatus === null
                      ? " 해당없음"
                      : targetUser.managementUserStatus === "host"
                      ? " 호스트"
                      : targetUser.managementUserStatus === "admin"
                      ? " 관리자"
                      : targetUser.managementUserStatus === "ban"
                      ? " 차단"
                      : null}
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
                        <button
                          className="management-btn"
                          onClick={() => setBan(!ban)}
                        >
                          벤
                        </button>
                        {loginDto.managementUserStatus === "host" && (
                          <button
                            className="management-btn"
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
                          className="management-btn"
                          onClick={() => {
                            setBan(!ban);
                          }}
                        >
                          벤연장
                        </button>
                        <button
                          className="management-btn"
                          onClick={() => agree(targetUser)}
                        >
                          벤취소
                        </button>
                      </>
                    ) : targetUser.managementUserStatus === "admin" &&
                      loginDto.managementUserStatus === "host" ? (
                      <>
                        <button
                          className="management-btn"
                          onClick={() => {
                            setHost(false);
                            setBan(false);
                            agree(targetUser);
                          }}
                        >
                          관리자 취소
                        </button>
                        <button
                          className="management-btn"
                          onClick={() => {
                            setHost(!host);
                            setBan(false);
                          }}
                        >
                          호스트로 임명
                        </button>
                        <button
                          className="management-btn"
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
                    <p className="email-text">이메일 인증이 필요합니다 </p>
                    <div className="email-box">
                      <button
                        className="email-submit-btn"
                        onClick={() => {
                          setSent(true);
                          goEmail(user.userEmail);
                          setResend(resend + 1);
                          setSecondsLeft(30);
                        }}
                      >
                        {send ? "재발송" : "발송"}
                      </button>

                      <input
                        className="code-input"
                        type="text"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                        disabled={secondsLeft != 0 ? false : true}
                      />
                      {send ? (
                        <Timer count={secondsLeft} setCount={setSecondsLeft} />
                      ) : (
                        <div className="timer-container"></div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        codeCheck({
                          userEmail: targetUser.userEmail,
                          managementUserStatus: "host",
                          channelCode: channelCode,
                          banDate: 0,
                        })
                      }
                      // 입력값의 길이가 0보다 크면서 발송버튼을 눌렀을경우 에만 false
                      disabled={!(emailCode.length > 0 && secondsLeft > 0)}
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
