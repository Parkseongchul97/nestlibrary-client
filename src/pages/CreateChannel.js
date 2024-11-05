import { useEffect, useState } from "react";
import "../assets/createChannel.scss";
import { create as makeChannel, nameCheck } from "../api/channel";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";

const CreateChannel = ({ onClose }) => {
  const navigate = useNavigate();
  const [channelPreviewUrl, setChannelPreviewUrl] = useState(null);
  const [nameSubmit, setNameSubmit] = useState(false);
  const [channel, setChannel] = useState({
    channelName: "",
    channelInfo: "",
    channelImg: null,
  });
  const deleteChannelImg = () => {
    setChannel({ ...channel, channelImg: null });
    setChannelPreviewUrl(null);
  };
  const closeChangeInfo = () => {
    onClose();
  };

  const check = async () => {
    const result = await nameCheck(channel.channelName, 0);
    // 반환 채널값이 없으면 true
    if (result.data === "") setNameSubmit(true);
    // 반환 채널값이 있다면 false
    else setNameSubmit(false);
  };
  const submitMakeChannel = async () => {
    if (!nameSubmit) {
      alert("채널 이름이 중복입니다!");
      return;
    }
    let formData = new FormData();
    formData.append("channelName", channel.channelName);
    formData.append("channelInfo", channel.channelInfo);

    if (channel.channelImg !== null)
      formData.append("channelImg", channel.channelImg);

    const result = await makeChannel(formData);

    if (result.data.channelCode === undefined) {
      // 채널 생성후 바로 해당 채널로 이동
      alert("포인트 부족 !");
    } else {
      navigate(`/channel/${result.data.channelCode}`);
    }
  };
  useEffect(() => {
    check();
  }, [channel.channelName]);

  return (
    <>
      <div className="create-channel-box">
        <div className="create-channel-header">채널 생성</div>

        <div className="create-box">
          <div className="create-channel-left">
            <label htmlFor="channel-img-file">
              {channelPreviewUrl ? (
                <img
                  id="preview-channel-img"
                  src={channelPreviewUrl}
                  alt="대문 미리보기"
                />
              ) : (
                <img
                  id="preview-channel-img"
                  src="http://192.168.10.51:8082/thumbnail/%EA%B8%B0%EB%B3%B8%EB%8C%80%EB%AC%B8.jpg"
                  alt="대문 미리보기"
                />
              )}
              <div className="create-channel-img-ikon">
                <FaCamera />
              </div>
            </label>
            <button
              id="create-channel-out"
              className="create-channel-btn"
              onClick={deleteChannelImg}
            >
              이미지 삭제
            </button>
          </div>
          <div className="create-channel-right">
            <h1>채널 생성에는 3000pt가 소모됩니다.</h1>
            <div className="create-channel-input-box">
              <input
                className="channel-input-text"
                placeholder={"채널 이름"}
                type="text"
                value={channel.channelName}
                onChange={(e) =>
                  setChannel({ ...channel, channelName: e.target.value })
                }
              />
            </div>
            <span>
              {channel.channelName === ""
                ? ""
                : nameSubmit
                ? ""
                : "채널명이 중복입니다."}
            </span>
            <div className="create-channel-input-box">
              <input
                className="channel-input-text"
                placeholder={"채널 소개"}
                type="text"
                value={channel.channelInfo}
                onChange={(e) =>
                  setChannel({ ...channel, channelInfo: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className="create-channel-bottom">
          <button className="create-channel-btn" onClick={closeChangeInfo}>
            닫기
          </button>

          <button onClick={submitMakeChannel} className="create-channel-btn">
            채널 생성
          </button>
        </div>
      </div>

      <div id="create-channel-bg" onClick={onClose}></div>
      <input
        className="channel-input-file"
        id="channel-img-file"
        type="file"
        accept={"image/*"}
        onChange={(e) => {
          const file = e.target.files[0]; // 첫 번째 파일 가져오기
          if (file) {
            // 있으면
            setChannel({ ...channel, channelImg: file });
            setChannelPreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 설정
          } else {
            setChannel({ ...channel, channelImg: null });
            setChannelPreviewUrl(null);
          }
        }}
      />
    </>
  );
};

export default CreateChannel;
