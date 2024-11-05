import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import {
  updateInfo,
  addTags,
  removeTags,
  infoUpdate,
  addImg,
  removeChannel,
} from "../api/channel";
import "../assets/channelUpdate.scss";
import { TbXboxX } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { checkEmail, sendCode } from "../api/email";
import { findUser as byNickname } from "../api/message";
import { useQuery } from "@tanstack/react-query";
import UserMenu from "../components/user/UserMenu";
import FindUser from "../components/user/FindUser";
import UserManagement from "./UserManagement";

const ChannelUpdate = () => {
  const { user } = useAuth(); // 발신자(로그인유저)
  const { channelCode } = useParams();
  const [previewUrl, setPreviewUrl] = useState("");

  const [isDelete, setIsDelete] = useState(false);
  const [code, setCode] = useState("");
  const [reCode, setReCode] = useState(false);
  const navigate = useNavigate();
  const [view, setView] = useState("door");

  const [chan, setChan] = useState({
    channelCode: channelCode,
    channelImg: null,
    change: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [inputNickname, setInputNickname] = useState("");
  const [toNickname, setToNickname] = useState(""); //
  const [viewNickname, setViewNickname] = useState("");

  //  업데이트 전  채널 정보들
  const [channelInfos, setChannelInfos] = useState({
    channelCode: "",
    channelName: "",
    adminList: [{}],
    banList: [{}],
    channelCreatedAt: "",
    favoriteCount: "",
    channelInfo: "",
    channelTag: [{}],
    channelImgUrl: "",
  });
  const [error, setError] = useState(null);

  // 업데이트전 채널 정보 불러옴
  const update = async () => {
    try {
      const result = await updateInfo(channelCode);
      setChannelInfos(result.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("채널을 찾을 수 없습니다.");
      } else {
        setError("서버에 문제가 발생했습니다.");
      }
    }
  };

  const {
    data: findUser,
    isLoading,
    errors,
  } = useQuery({
    queryKey: ["findUser", toNickname],
    queryFn: () => byNickname(toNickname),
    enabled: toNickname.length > 1,
  });

  useEffect(() => {
    update();
  }, []);

  const [tags, setTags] = useState({
    channelCode: channelCode,
    channelTagName: "",
  });

  // 입력된 태그 정보 DB로 전송
  const getTag = () => {
    tagUpdate();
  };

  const tagUpdate = async () => {
    await addTags(tags);
    update();
  };

  const tagDelete = async (channelTagCode) => {
    await removeTags(channelTagCode);
    update();
  };

  const infoSubmit = async () => {
    await infoUpdate(channelInfos);
    update();
  };

  const remove = async () => {
    await removeChannel(channelCode);
    navigate("/");
  };

  let formData = new FormData();

  const imgUpdate = async () => {
    if (chan.channelImg !== null) {
      formData.append("channelImg", chan.channelImg);
      formData.append("channelCode", channelCode);
      formData.append("change", chan.change);
      await addImg(formData);
      update();
    } else {
      formData.append("channelCode", channelCode);
      formData.append("change", chan.change);
      await addImg(formData);
      update();
    }
  };

  const reset = () => {
    if (channelInfos.channelImgUrl != null) {
      setPreviewUrl(
        `http://192.168.10.51:8083/channel/${channelCode}/${channelInfos.channelImgUrl}`
      );
    } else {
      setPreviewUrl(null);
    }
    setChan({ ...chan, channelImg: null, change: 0 });
    document.querySelector(".change-input-file").value = "";
  };

  const regular = () => {
    setPreviewUrl(
      "http://192.168.10.51:8083/%EA%B8%B0%EB%B3%B8%EB%8C%80%EB%AC%B8.jpg"
    );
    setChan({ ...chan, channelImg: null, change: -1 });
    document.querySelector(".change-input-file").value = "";
  };

  const getCode = async () => {
    setReCode(true);
    await sendCode(user.userEmail);
    alert("인증번호가 발송되었습니다");
  };
  const submitCode = async () => {
    const response = await checkEmail(code);
    if (response.data) {
      const result = window.confirm("정말 삭제하실 건가요?");
      if (result) {
        alert("삭제 되었습니다 ");
        remove();
      } else {
        alert("삭제가 취소 되었습니다");
      }
    }
  };

  const findSubmit = () => {
    setToNickname(inputNickname);
    setIsOpen(true);
  };
  const selectedUser = (targetUser) => {
    // 여기서 필요한곳에 타겟 유저.필요한정보 담기
    setViewNickname(targetUser?.userNickname);
  };
  const deleteToUser = () => {
    // 여기서 타겟유저 정보 담아둔거 날리기
    setToNickname("");
    setViewNickname("");
    setInputNickname("");
  };

  const getOpenType = (data) => {
    setView(data);
  };

  return (
    <>
      <div className="channelUpdate-container">
        <div className="channelUpdate-box">
          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="channelUpdate-header">
                <div className="channelUpdate-channelName">
                  {channelInfos.channelName}
                </div>
                <div className="channelUpdate-link">
                  <Link to={"/channel/" + channelCode}>바로가기</Link>
                </div>
              </div>
              <div className="channelUpdate-content">
                <div className="channelUpdate-left">
                  <div
                    style={{ color: view === "door" ? "red" : "white" }}
                    onClick={() => getOpenType("door")}
                  >
                    대문수정
                  </div>
                  <div
                    style={{ color: view === "user" ? "red" : "white" }}
                    onClick={() => getOpenType("user")}
                  >
                    유저관리
                  </div>
                  <div
                    style={{ color: view === "channel" ? "red" : "white" }}
                    onClick={() => getOpenType("channel")}
                  >
                    채널관리
                  </div>
                </div>
                <div className="channelUpdate-right">
                  {view === "door" ? (
                    <>
                      <div className="channelUpdate-img">
                        <div className="channelUpdate-info">
                          <div className="channelUpdate-text">채널소개</div>
                          <div className="channelUpdate-input">
                            <input
                              value={channelInfos.channelInfo}
                              onChange={(e) =>
                                setChannelInfos({
                                  ...channelInfos,
                                  channelInfo: e.target.value,
                                })
                              }
                            />
                            <button onClick={infoSubmit}> 변경 </button>
                          </div>
                        </div>
                        <div className="channelUpdate-img-container">
                          <div className="channelUpdate-imgUpdate">
                            이미지 수정
                          </div>

                          <label htmlFor="change-channel-img">
                            <img
                              className="channelUpdate-channel-img"
                              src={
                                previewUrl ||
                                (channelInfos.channelImgUrl === null
                                  ? "http://192.168.10.51:8083/%EA%B8%B0%EB%B3%B8%EB%8C%80%EB%AC%B8.jpg"
                                  : `http://192.168.10.51:8083/channel/${channelCode}/${channelInfos.channelImgUrl}`)
                              }
                            />
                            <div className="channelUpdate-ikon">
                              <FaCamera />
                            </div>
                          </label>
                        </div>
                        <div className="channelUpdate-buttones">
                          <input
                            className="change-input-file"
                            type="file"
                            id="change-channel-img"
                            accept={"image/*"}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setPreviewUrl(URL.createObjectURL(file));
                                setChan({
                                  ...chan,
                                  channelImg: file,
                                  change: 1,
                                });
                              } else {
                                setPreviewUrl(false);
                                setChan({
                                  ...chan,
                                  channelImg: null,
                                  change: 0,
                                });
                              }
                            }}
                          />
                          <div className="channelUpdate-button-option">
                            <button onClick={reset}>되돌리기 </button>
                            <button onClick={regular}>기본 사진</button>
                            <button onClick={imgUpdate}>적용 하기</button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : view === "user" ? (
                    <UserManagement channelCode={channelCode} />
                  ) : (
                    <>
                      <div className="channelUpdate-tagList">
                        <div className="tagList"> 태그 리스트</div>
                        <div className="tagInfo">
                          원하는 게시판의 이름을 만들어보세요 (공지,일반
                          게시판은 고정게시판입니다)
                          <p>
                            * 게시판 삭제시 기존 게시글들은 "일반" 게시판으로
                            이동합니다
                          </p>
                        </div>
                        <div className="channelUpdate-allTag">
                          {channelInfos.channelTag.map((channelTags, index) => (
                            <>
                              {!(
                                channelTags.channelTagName == "일반" ||
                                channelTags.channelTagName == "공지"
                              ) ? (
                                <div
                                  className="channelUpdate-tag"
                                  key={channelTags.channelTagCode}
                                >
                                  {channelTags.channelTagName}
                                  <TbXboxX
                                    className="cancle-ikon"
                                    onClick={() =>
                                      tagDelete(channelTags.channelTagCode)
                                    }
                                  />
                                </div>
                              ) : (
                                <div
                                  className="channelUpdate-tag"
                                  key={channelTags.channelTagCode}
                                >
                                  {channelTags.channelTagName}
                                </div>
                              )}
                            </>
                          ))}
                        </div>
                        <div className="channelUpdate-addTag">
                          <input
                            type="text"
                            value={tags.channelTagName}
                            onChange={(e) =>
                              setTags({
                                ...tags,
                                channelTagName: e.target.value,
                              })
                            }
                          />
                          <button onClick={getTag}>태그 추가</button>
                          <button
                            onClick={() => {
                              setIsDelete(!isDelete);
                            }}
                          >
                            채널삭제
                          </button>
                          {isDelete && (
                            <>
                              <div>
                                채널 삭제는 이메일 인증코드가 필요 합니다{" "}
                              </div>
                              <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                              />
                              <button onClick={getCode}>
                                {reCode ? "재발송" : "발송"}
                              </button>
                              <button onClick={submitCode}>확인</button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ChannelUpdate;
