import React, { useState, useRef, useEffect, useMemo } from "react";
import JoditEditor from "jodit-react";
import { Link, useLocation } from "react-router-dom";
import { add, update, write } from "../../api/post";
import "../../assets/edit.scss";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../assets/postWrite.scss";

const PostWrite = () => {
  const { user } = useAuth();
  const location = useLocation(); // 추가된 부분
  const isChannelCode = location.state?.isChannelCode; // 추가된 부분
  const isPost = location.state?.isPost;
  const editor = useRef(null);
  const navigate = useNavigate();

  const [post, setPost] = useState({
    postCode: isPost?.postCode ? isPost.postCode : 0,
    postContent: isPost?.postContent ? isPost?.postContent : "",
    postTitle: isPost?.postTitle ? isPost?.postTitle : "",
    userEmail: user.userEmail,
    channel: { channelCode: isChannelCode },
    channelTag: {
      channelTagName: isPost?.channelTag?.channelTagName,
      channelTagCode: isPost?.channelTag?.channelTagCode,
      channelCode: isPost?.channelTag?.channelCode,
    },
  });

  const [Channel, setChannel] = useState({
    channelTag: [
      {
        channelTagName: "",
        channelTagCode: "",
        channelCode: "",
      },
    ],
  });

  const channelInfo = async () => {
    const result = await write(isChannelCode);

    setChannel(result.data);
  };

  useEffect(() => {
    channelInfo();
  }, []);

  useEffect(() => {
    const firstTag =
      post?.channelTag?.channelTagName !== undefined
        ? Channel.channelTag.find(
            (item) => item.channelTagName === post?.channelTag.channelTagName
          )
        : Channel.channelTag.find((item) => item.channelTagName === "일반");
    if (firstTag) {
      setPost({
        ...post,
        channelTag: {
          channelTagCode: String(firstTag.channelTagCode),
        },
      });
    }
  }, [Channel]);

  const config = {
    readonly: false,
    toolbar: true,
    buttons: [
      {
        name: "underline", // 버튼 이름
        action: "underline", // 버튼 동작 (실제 실행할 명령)
        tooltip: "밑줄", // 툴팁 텍스트
      },
      {
        name: "strikethrough", // 버튼 이름
        action: "strikethrough", // 버튼 동작 (실제 실행할 명령)
        tooltip: "취소선", // 툴팁 텍스트
      },
      {
        name: "left", // 버튼 이름
        action: "left", // 버튼 동작 (실제 실행할 명령)
        tooltip: "왼쪽", // 툴팁 텍스트
      },
      {
        name: "center", // 버튼 이름
        action: "center", // 버튼 동작 (실제 실행할 명령)
        tooltip: "가운데정렬", // 툴팁 텍스트
      },

      {
        name: "right", // 버튼 이름
        action: "right", // 버튼 동작 (실제 실행할 명령)
        tooltip: "오른쪽 정렬", // 툴팁 텍스트
      },

      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",

      {
        name: "image", // 버튼 이름
        action: "image", // 버튼 동작 (실제 실행할 명령)
        tooltip: "사진추가 ", // 툴팁 텍스트
      },
      {
        name: "fontsize", // 버튼 이름
        action: "fontsize", // 버튼 동작 (실제 실행할 명령)
        tooltip: "글짜 크기 ", // 툴팁 텍스트
      },
      {
        name: "video", // 버튼 이름
        action: "video", // 버튼 동작 (실제 실행할 명령)
        tooltip: "코드로 동영상 추가 ", // 툴팁 텍스트
      },
    ], // 툴바에 표시할 버튼들

    uploader: {
      insertImageAsBase64URI: true,

      url: "upload_image.php",
    },
    placeholder: "내용을 입력하세요...",
    minHeight: 200,
    // 필요에 따라 추가 설정
  };

  // 작성
  const addPost = async () => {
    if (post.postTitle.trim().length <= 1) {
      alert("제목은 2글자 이상이여야 합니다");
      return;
    }
    if (post.postContent.trim().length == 0) {
      alert("내용을 입력해주세요");
      return;
    }

    const response = await add(post);
    if (response.data.managementUserStatus === "ban") {
      alert("글쓰기가 제한되어있습니다");
      return;
    }

    window.location.href =
      "/channel/" +
      response.data.channel.channelCode +
      "/post/" +
      response.data.postCode;
  };
  // 수정
  const updatePost = async () => {
    if (post.postTitle.trim().length <= 1) {
      alert("제목은 2글자 이상이여야 합니다");
      return;
    }
    if (post.postContent.trim().length == 0) {
      alert("내용을 입력해주세요");
      return;
    }

    const response = await update(post);
    if (response.data.managementUserStatus === "ban") {
      alert("글쓰기가 제한되어있습니다");
      return;
    }
    window.location.href = `/channel/${response.data?.channelCode}/post/${response.data?.postCode}`;
  };

  return (
    <>
      <div className="postWrite-container">
        <div className="postWrite-box">
          <div className="postWrite-channel-name">
            {Channel?.channelName} 채널
          </div>
          <div className="postWrite-main-content">
            <div className="postWrite-select-tag">
              <select
                id="tag"
                onChange={(e) =>
                  setPost({
                    ...post,
                    channelTag: { channelTagCode: e.target.value },
                  })
                }
                value={post.channelTag.channelTagCode}
              >
                {Channel?.channelTag.map((channelTag) => (
                  <option
                    value={channelTag.channelTagCode}
                    key={channelTag.channelTagCode}
                  >
                    {channelTag.channelTagName}
                  </option>
                ))}
              </select>
              <input
                placeholder="제목을 입력하세요"
                type="text"
                value={post.postTitle}
                onChange={(e) =>
                  setPost({ ...post, postTitle: e.target.value })
                }
                key={post.postCode}
              />
            </div>
            <JoditEditor
              ref={editor}
              value={post.postContent}
              config={config}
              tabIndex={1}
              onBlur={(newContent) =>
                setPost({ ...post, postContent: newContent })
              }
              onChange={(newContent) => {}}
            />
            <div className="postWrite-button">
              <>
                <div className="postWrite-buttones">
                  <Link
                    className="postWrite-submit"
                    to={"/channel/" + Channel.channelCode}
                  >
                    취소
                  </Link>

                  {isPost !== undefined ? (
                    <button className="postWrite-submit" onClick={updatePost}>
                      수정
                    </button>
                  ) : (
                    <button className="postWrite-submit" onClick={addPost}>
                      작성
                    </button>
                  )}
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostWrite;
