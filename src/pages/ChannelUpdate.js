import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  updateInfo,
  addTags,
  removeTags,
  infoUpdate,
  addImg,
  removeChannel,
} from "../api/channel";
import { findUser as byNickname } from "../api/message";
import { original } from "@reduxjs/toolkit";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import UserMenu from "../components/UserMenu";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { sendCode, checkEmail } from "../api/email";
import { useNavigate } from "react-router-dom";

const ChannelUpdate = () => {
  const { user } = useAuth(); // 발신자(로그인유저)
  const { channelCode } = useParams();
  const [previewUrl, setPreviewUrl] = useState("");
  const location = useLocation();
  const [isDelete, setIsDelete] = useState(false);
  const [code, setCode] = useState("");
  const [reCode, setReCode] = useState(false);
  const navigate = useNavigate();

  let toUser = null;
  toUser = location.state !== null ? location.state.toUser : undefined;

  const [toNickname, setToNickname] = useState(""); // 수신자 찾기
  const [inputNickname, setInputNickname] = useState(
    toUser !== undefined ? toUser.nickname : ""
  ); //입력한 닉네임
  const [chan, setChan] = useState({
    channelCode: channelCode,
    channelImg: null,
    change: "",
  });
  const [viewNickname, setViewNickname] = useState(
    toUser !== undefined ? toUser.nickname : ""
  );
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

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
  const selectedUser = (targetUser) => {
    setViewNickname(targetUser?.userNickname);
  };
  const deleteToUser = () => {
    setToNickname("");

    setViewNickname("");
    setInputNickname("");
  };

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

  // 필요한것 벤 리스트 O  , 관리자 리스트  O, (현재가진 태그 목록 O  + 태그 추가 / 삭제 기능 O ) , 사진변경 O , 소개 변경 O
  // 수정되는 부분을 같은 vo가 처리하는 부분끼리 나누기
  // img => channelDTO
  // info => channel
  // tag  => channelTag
  // ban , admin  => management

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

  if (isLoading) return <> 로딩중 </>;
  if (errors) return <>에러</>;

  return (
    <>
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <ul>
            관리자들
            {channelInfos.adminList.map((admins, index) =>
              index === 0 ? (
                <li key={admins.userEmail}>호스트 : {admins.userEmail}</li>
              ) : (
                <li key={admins.userEmail}>관리자 : {admins.userEmail}</li>
              )
            )}
          </ul>
          채널소개 :{" "}
          <input
            value={channelInfos.channelInfo}
            onChange={(e) =>
              setChannelInfos({ ...channelInfos, channelInfo: e.target.value })
            }
          />
          <button onClick={infoSubmit}> 변경 </button>
          <ul>
            차단 리스트
            {channelInfos.banList.map((bans) => (
              <li key={bans.userEmail}>{bans.userEmail}</li>
            ))}
          </ul>
          <input
            placeholder="받는사람"
            type="text"
            value={inputNickname}
            onChange={(e) => {
              setInputNickname(e.target.value);
            }}
          />
          <button onClick={findSubmit}>찾기</button>
          {findUser !== undefined &&
            isOpen &&
            findUser.data.map(
              (targetUser) =>
                targetUser.userEmail !== user.userEmail && (
                  <div>
                    <UserMenu user={targetUser} key={targetUser.userEmail} />
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
          <div>
            <ul>
              태그 리스트
              {channelInfos.channelTag.map((channelTags, index) => (
                <>
                  <li key={channelTags.channelTagCode}>
                    {channelTags.channelTagName}
                  </li>
                  {!(
                    channelTags.channelTagName == "일반" ||
                    channelTags.channelTagName == "공지"
                  ) ? (
                    <button
                      key={index}
                      onClick={() => tagDelete(channelTags.channelTagCode)}
                    >
                      삭제
                    </button>
                  ) : null}
                </>
              ))}
            </ul>
            <input
              type="text"
              value={tags.channelTagName}
              onChange={(e) =>
                setTags({ ...tags, channelTagName: e.target.value })
              }
            />
            <button onClick={getTag}>추가</button>
          </div>
          <p>이미지 </p>
          추가:
          <input
            className="change-input-file"
            type="file"
            accept={"image/*"}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
                setChan({ ...chan, channelImg: file, change: 1 });
              } else {
                setPreviewUrl(false);
                setChan({ ...chan, channelImg: null, change: 0 });
              }
            }}
          />
          <button onClick={imgUpdate}>사진 수정</button>
          <button onClick={reset}>기존 사진 </button>
          <button onClick={regular}>기본 사진</button>
          <img
            src={
              previewUrl ||
              (channelInfos.channelImgUrl === null
                ? "http://192.168.10.51:8083/%EA%B8%B0%EB%B3%B8%EB%8C%80%EB%AC%B8.jpg"
                : `http://192.168.10.51:8083/channel/${channelCode}/${channelInfos.channelImgUrl}`)
            }
          />
          <button
            onClick={() => {
              setIsDelete(!isDelete);
            }}
          >
            채널삭제
          </button>
          {isDelete && (
            <>
              <div>채널 삭제는 이메일 인증코드가 필요 합니다 </div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button onClick={getCode}>{reCode ? "재발송" : "발송"}</button>
              <button onClick={submitCode}>확인</button>
            </>
          )}
          <Link to={"/channel/" + channelCode}>바로가기</Link>
        </>
      )}
    </>
  );
};

export default ChannelUpdate;
