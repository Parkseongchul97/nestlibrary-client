import { useEffect } from "react";
import { channelInfo, allPosts, tagPosts } from "../api/channel";
import { Link, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { addSub, checkSub, removeSub } from "../api/subscribe";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Login from "./Login";

import PostListComponent from "../components/PostListComponent";
import "../assets/channelDetail.scss";
import "../assets/main.scss";
import Page from "../components/Page";
import Search from "../components/Search";

const ChannelDetail = () => {
  const { user, token } = useAuth(); // 로그인 유저
  const { channelCode, channelTagCode } = useParams();
  const [channel, setChannel] = useState(null); // 채널정보
  const [posts, setPosts] = useState([]); // 채널 내의 게시판 정보
  const queryClient = useQueryClient();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = query.get("page") || 1;
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
  const [searchTarget, setSearchTarget] = useState("title"); // 기본 검색 대상: 제목
  const fetch = async () => {
    const info = await channelInfo(channelCode);
    setChannel(info.data);
    const channelPosts =
      channelTagCode !== undefined
        ? await tagPosts(
            channelCode,
            channelTagCode,
            page,
            searchTarget,
            searchKeyword
          ) // 태그가 있으면 태그별 게시글 가져오기
        : await allPosts(channelCode, page, searchTarget, searchKeyword); // 태그가 없으면 모든 게시글 가져오기
    setPosts(channelPosts.data);
  };

  const write = () => {
    window.location.href = "/write/" + channelCode;
  };

  useEffect(() => {
    fetch();
  }, [channelCode, channelTagCode, page]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscribe", channelCode],
    queryFn: () => (token ? checkSub(channelCode) : null),
    enabled: !!token,
  });
  // 구독
  const addSubMutation = useMutation({
    mutationFn: addSub,
    onSuccess: () => {
      queryClient.invalidateQueries(["subscribe", channelCode]);
    },
  });

  // 구독 취소
  const removeSubMutation = useMutation({
    mutationFn: removeSub,
    onSuccess: () => {
      queryClient.invalidateQueries(["subscribe", channelCode]);
    },
  });
  const addSubSubmit = () => {
    if (token !== null) {
      const subContent = {
        userEmail: user.userEmail,
        //channelCode: channelCode,
        channel: {
          channelCode: channelCode,
        },
      };
      addSubMutation.mutate(subContent);
    }
    setChannel({
      ...channel,
      favoriteCount: channel?.favoriteCount + 1,
    });
  };
  const searchSubmit = () => {
    if (searchKeyword.length <= 1) {
      alert("2글자 이상 입력해야 합니다!");
      return;
    }

    fetch();
  };

  const removeSubSubmit = () => {
    // 매니지먼트 코드 보내서 삭제
    removeSubMutation.mutate(data.data?.managementCode);
    setChannel({
      ...channel,
      favoriteCount: channel?.favoriteCount - 1,
    });
  };
  if (isLoading) return <>로딩</>;
  if (error) return <>에러</>;
  return (
    <>
      <div className="channel-detail-box">
        <div className="channel-box">
          <div className="channel-header">
            {!token ? null : data?.data ? (
              <button onClick={removeSubSubmit}>구독취소</button>
            ) : (
              <button onClick={addSubSubmit}>구독</button>
            )}
            {token && <button onClick={write}>글쓰기</button>}
            <h1>{channel?.channelName}</h1>
            <p>구독자수 : {channel?.favoriteCount}</p>
            <img
              src={
                channel?.channelImgUrl != null
                  ? "http://192.168.10.51:8083/channel/" +
                    channelCode +
                    "/" +
                    channel?.channelImgUrl
                  : "http://192.168.10.51:8083/%EA%B8%B0%EB%B3%B8%EB%8C%80%EB%AC%B8.jpg"
              }
            />
          </div>
          <div className="channel-main">
            <div className="tag-box">
              <Link
                id={"channel-" + channelCode + "-tag-" + "0"}
                className={
                  channelTagCode === undefined ? "tag selected-tag" : "tag"
                }
                to={"/channel/" + channelCode}
              >
                전체
              </Link>
              {channel?.channelTag.map((channelTag) => (
                <Link
                  id={
                    "channel-" +
                    channelCode +
                    "-tag-" +
                    channelTag.channelTagCode
                  }
                  className={
                    Number(channelTagCode) === channelTag.channelTagCode
                      ? "tag selected-tag"
                      : "tag"
                  }
                  to={
                    "/channel/" + channelCode + "/" + channelTag.channelTagCode
                  }
                  key={channelTag.channelTagCode}
                >
                  {}
                  {}
                  {channelTag.channelTagName}
                </Link>
              ))}
            </div>
            <div className="post-box">
              {posts?.postList === undefined || posts?.postList === null ? (
                <div className="none-post-box">
                  <div>!</div>
                  <p>게시글이 없습니다.</p>
                </div>
              ) : (
                posts?.postList?.map((post) => (
                  <PostListComponent post={post} key={post?.postCode} />
                ))
              )}
            </div>
            {posts?.paging !== undefined && posts?.paging.totalPage !== 0 && (
              <div className="page-btn">
                <Page
                  page={posts?.paging.page}
                  totalPages={parseInt(posts?.paging.totalPage / 10)}
                />
              </div>
            )}
            <Search
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              searchTarget={searchTarget}
              setSearchTarget={setSearchTarget}
              onSubmit={searchSubmit}
            />
          </div>
        </div>
      </div>

      <Link to={`/update/${channelCode}`}>채널수정</Link>
    </>
  );
};
export default ChannelDetail;
