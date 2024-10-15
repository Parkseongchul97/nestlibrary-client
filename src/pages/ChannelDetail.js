import { useEffect } from "react";
import { main , sub as subPost} from "../api/channel";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { addSub, check, removeSub, countSub } from "../api/subscribe";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Login from "./Login";
import PostEditor from "../components/Edit";
import PostListComponent from "../components/PostListComponent";

const ChannelDetail = () => {
  const openPage = () => {
    setPage(true);
  };
  const [page, setPage] = useState(false);
  const closeLogin = () => {
    setPage(false);
  };
  const { user } = useAuth();
  const { channelCode , channelTagCode} = useParams();
  const [isSub, setIsSub] = useState("");
  const [count, setCount] = useState();
  const [Channel, setChannel] = useState({
    channelTag: [
      {
        channelTagName: "",
        channelTagCode: "",
        channelCode: "",
      },
    ],
  });
  const [postList, setPostList] = useState({  
    channelTagCode: 0,
    channelTagName: "",
    posts : [],    
  })



  const channelInfo = async () => {
    const result = await main(channelCode);

    setChannel(result.data);
  };

  const channelsubInfo = async () =>{
    const result = await subPost(channelCode, channelTagCode)
    setPostList(result.data);
    console.log("채널 태그도 왔음")
    console.log(postList)
  }

  const write = () => {
    window.location.href = "/write/" + channelCode;
  };
  const queryClient = useQueryClient();

  // 무조건 data를 쓰고 이름을 바꾸고 싶으면 ( data : 변수명 )
  // 구독자 수 띄우기 연습
  const {
    data: subs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subs", channelCode],
    queryFn: () => countSub(channelCode),
    refetchInterval: 1000, // 1초 -> 데이터 갱신을 해줌
  });

  useEffect(() => {
    if(channelTagCode === undefined){
      channelInfo();
      console.log("태그안옴")
    } else{
      channelsubInfo();
      console.log("태그옴")
    }
    if (localStorage.getItem("token") != null) subCheck();
  }, [channelCode]);



  const subCount = async () => {
    const result = await countSub(channelCode);
    setCount(result.data);
  };

  const subCheck = async () => {
    const result = await check(channelCode);
    setIsSub(result.data);

  };

  const sub = async (data) => {
    if (localStorage.getItem("token") == null) {
      openPage();
      return;
    }
    await addSub(data);

    subCheck();
    // subCount();
  };

  const remove = async () => {
    await removeSub(isSub?.managementCode);
    subCheck();
  };

  if (isLoading) return <>로딩중...</>;

  // 에러 발생 했을 때 처리
  if (error) return <>에러 발생...</>;

  return (
    <>

      <div className="main-box">
        !!채널메인!!
        {postList !== null ?  postList?.posts.map((post) => (
                  <PostListComponent post={post} key={post?.postCode} />
                )): <p>게시글이 읍서요</p>}
        <p>{Channel?.channelName}</p>
        <img
          src={
            Channel?.channelImgUrl != null
              ? "http://192.168.10.51:8083/channel/" +
                channelCode +
                "/" +
                Channel?.channelImgUrl
              : "http://192.168.10.51:8083/%EA%B8%B0%EB%B3%B8%EB%8C%80%EB%AC%B8.jpg"
          }
        />
        {Channel?.channelTag.map((channelTag) => (
          <li>{channelTag.channelTagName}</li>
        ))}
      </div>

      {isSub === "" ? (
        <button
          onClick={() =>
            sub({
              userEmail: user.userEmail,
              channelCode: channelCode,
            })
          }
        >
          구독
        </button>
      ) : isSub?.managementUserStatus === "host" ? (
        <button>내 채널</button>
      ) : isSub?.managementUserStatus === "admin" ? (
        <button>관리자</button>
      ) : isSub?.managementUserStatus === "sub" ? (
        <button onClick={remove}>구독취소</button>
      ) : null}

      <p> 구독자 수 : {subs.data} 명 </p>

      {page && <Login onClose={closeLogin} />}
      <button onClick={write}>글쓰기</button>
    </>
  );
};
export default ChannelDetail;
