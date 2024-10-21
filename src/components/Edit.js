import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { useParams } from "react-router-dom";
import { add, write } from "../api/post";
import "../assets/edit.scss";
import { useAuth } from "../contexts/AuthContext";

const Example = () => {
  const { user } = useAuth();

  const { channelCode } = useParams();

  const editor = useRef(null);

  const [post, setPost] = useState({
    postContent: "",
    postTitle: "",
    userEmail: user.userEmail,
    channel: { channelCode: channelCode },
    channelTag: {
      channelTagCode: "",
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
    const result = await write(channelCode);

    setChannel(result.data);
  };

  useEffect(() => {
    channelInfo();
  }, []);

  useEffect(() => {
    const firstTag = Channel.channelTag.find(
      (item) => item.channelTagName === "일반"
    );
    if (firstTag) {
      setPost({
        ...post,
        channelTag: { channelTagCode: String(firstTag.channelTagCode) },
      });
    }
  }, [Channel]);

  const config = {
    readonly: false,
    toolbar: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "link",
      "image",
      "fontsize",
    ],
    uploader: {
      insertImageAsBase64URI: true,

      url: "upload_image.php",
    },
    placeholder: "내용을 입력하세요...",
    minHeight: 200,
    // 필요에 따라 추가 설정
  };
  const con = async () => {
    if (post.postTitle.trim().length == 0) {
      alert("제목을 입력해주세요");
      return;
    }
    if (post.postContent.trim().length == 0) {
      alert("내용을 입력해주세요");
    }

    const response = await add(post);
    if (response.data.managementUserStatus === "ban") {
      alert("글쓰기가 제한되어있습니다");
      return;
    }
    window.location.href = "/post/" + response.data.postCode;
  };

  return (
    <>
      <input
        placeholder="제목을 입력하세요"
        type="text"
        value={post.postTitle}
        onChange={(e) => setPost({ ...post, postTitle: e.target.value })}
      />
      <select
        id="tag"
        onChange={(e) =>
          setPost({ ...post, channelTag: { channelTagCode: e.target.value } })
        }
      >
        {Channel?.channelTag.map((channelTag) => (
          <option
            value={channelTag.channelTagCode}
            selected={channelTag.channelTagName === "일반" ? true : false}
          >
            {channelTag.channelTagName}
          </option>
        ))}
      </select>
      <JoditEditor
        ref={editor}
        value={post.postContent}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setPost({ ...post, postContent: newContent })}
        onChange={(newContent) => {}}
      />
      <button onClick={con}>작성</button>
    </>
  );
};

export default Example;
