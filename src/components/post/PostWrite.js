import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { useLocation } from "react-router-dom";
import { add, update, write } from "../../api/post";
import "../../assets/edit.scss";
import { useAuth } from "../../contexts/AuthContext";

const PostWrite = () => {
  const { user } = useAuth();
  const location = useLocation(); // 추가된 부분
  const isChannelCode = location.state?.isChannelCode; // 추가된 부분
  const isPost = location.state?.isPost;
  const editor = useRef(null);

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
    console.log(isPost);
    console.log(post);
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
    console.log(response.data);
    if (response.data?.managementUserStatus === "ban") {
      alert("글쓰기가 제한되어있습니다");
      return;
    }
    if (response.data === "") {
      alert("같은 내용의 글은 작성할 수 없습니다!");
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
      <input
        placeholder="제목을 입력하세요"
        type="text"
        value={post.postTitle}
        onChange={(e) => setPost({ ...post, postTitle: e.target.value })}
        key={post.postCode}
      />

      <select
        id="tag"
        onChange={(e) =>
          setPost({ ...post, channelTag: { channelTagCode: e.target.value } })
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
      <JoditEditor
        ref={editor}
        value={post.postContent}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setPost({ ...post, postContent: newContent })}
        onChange={(newContent) => {}}
      />
      {isPost !== undefined ? (
        <button onClick={updatePost}>수정</button>
      ) : (
        <button onClick={addPost}>작성</button>
      )}
    </>
  );
};

export default PostWrite;
