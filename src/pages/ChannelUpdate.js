import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  updateInfo,
  addTags,
  removeTags,
  infoUpdate,
  addImg,
  removeChannel,
} from "../api/channel";
import FindUser from "../components/FindUser";

const ChannelUpdate = () => {
  const { channelCode } = useParams();
  const [previewUrl, setPreviewUrl] = useState("");
  const [chan, setChan] = useState({
    channelCode: channelCode,
    channelImg: null,
    change: "",
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
    window.location.href = "/";
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

  const findSubmit = () => {
    // 찾기버튼 누를시 넣어서 찾고 열어줌
    setToNickname(inputNickname);
    setIsOpen(true);
    // 검색결과가 없는경우 얼럿 추가
  };
  const selectedUser = (targetUser) => {
    // 선택 누르면 필요값 담고 선택한 사람 닉네임 노출
    setViewNickname(targetUser?.userNickname);
  };
  const deleteToUser = () => {
    setToNickname("");
    setViewNickname("");
    setInputNickname("");
  };

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
          <FindUser
            toNickname={toNickname}
            inputNickname={inputNickname}
            setInputNickname={setInputNickname}
            findSubmit={findSubmit}
            viewNickname={viewNickname}
            deleteToUser={deleteToUser}
            selectedUser={selectedUser}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
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
          <button onClick={remove}>채널삭제</button>
        </>
      )}
    </>
  );
};

export default ChannelUpdate;
