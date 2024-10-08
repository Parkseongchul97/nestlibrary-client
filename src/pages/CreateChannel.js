import { useState } from "react";
import "../assets/createChannel.scss";
import { create as makeChannel } from "../api/channel";
import { useNavigate } from "react-router-dom";

const CreateChannel = ({ onClose }) => {
  const navigate = useNavigate();
  const [channelPreviewUrl, setChannelPreviewUrl] = useState(null);
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
  const submitMakeChannel = async () => {
    let formData = new FormData();
    formData.append("channelName", channel.channelName);
    formData.append("channelInfo", channel.channelInfo);
    console.log(channel.channelImg);
    if (channel.channelImg !== null)
      formData.append("channelImgUrl", channel.channelImg);
    console.log("submit때 formdata : ");
    console.log(formData);
    const result = await makeChannel(formData);
    console.log(result.data);
    if (result.status === 200) {
      // 채널 생성후 바로 해당 채널로 이동
      navigate(`/channel/${result.data.channelCode}`);
    }
  };

  return (
    <>
      <div className="create-channel-box">
        <button className="close" onClick={closeChangeInfo}>
          닫기
        </button>
        <h1>채널 생성에는 3000pt가 소모됩니다.</h1>
        <div className="create-box">
          <div className="channel-input-box">
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
          <div className="channel-input-box">
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
          </label>
          <button id="channel-img-delete" onClick={deleteChannelImg}>
            이미지 삭제
          </button>
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

          <button onClick={submitMakeChannel} className="submit-btn">
            채널 생성
          </button>
        </div>
      </div>

      <div id="create-channel-bg" onClick={onClose}></div>
    </>
  );
};

export default CreateChannel;