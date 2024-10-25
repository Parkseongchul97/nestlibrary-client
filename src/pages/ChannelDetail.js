import { useEffect } from "react";
import {
  channelInfo,
  allPosts,
  tagPosts,
  bestPosts,
  tagBestPosts,
} from "../api/channel";
import { Link, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { addSub, checkSub, removeSub } from "../api/subscribe";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const [viewType, setViewType] = useState("all");
  const queryClient = useQueryClient();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  let page = query.get("page") || 1;

  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
  const [searchTarget, setSearchTarget] = useState("title"); // 기본 검색 대상: 제목
  const fetch = async () => {
    const info = await channelInfo(channelCode);
    setChannel(info.data);
    const channelPosts =
      viewType === "best" && channelTagCode === undefined // 베스트면서 채널 태그코드가 없으면
        ? await bestPosts(channelCode, page, searchTarget, searchKeyword) // 모든 인기글
        : viewType === "best" && channelTagCode !== undefined // 베스트면서 채널 태그코드가 있으면
        ? await tagBestPosts(
            channelCode,
            channelTagCode,
            page,
            searchTarget,
            searchKeyword
          ) // 태그가 있으면 태그별 게시글 가져오기
        : viewType === "all" && channelTagCode !== undefined
        ? await tagPosts(
            channelCode,
            channelTagCode,
            page,
            searchTarget,
            searchKeyword
          )
        : await allPosts(channelCode, page, searchTarget, searchKeyword); // 태그가 없으면 모든 게시글 가져오기
    setPosts(channelPosts.data);
  };
  useEffect(() => {
    // 3가지 채널 태그코드가있으면 -> 상세태그 채널 태그코드가 없으면 best
    // if (channelTagCode === undefined) {
    //   setViewType("all");
    // } else {
    //   setViewType("best");
    // }
  }, [viewType]);
  useEffect(() => {
    fetch();
  }, [channelCode, channelTagCode, page, viewType]);

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
    // 검색 할시 페이지를 1로 설정해야함
    query.set("page", 1);
    page = query.get("page") || 1;
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
            {token && (
              <Link to="/write" state={{ isChannelCode: channelCode }}>
                글쓰기
              </Link>
            )}
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
                  onClick={() => setSearchKeyword("")}
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
                  totalPages={Math.ceil(posts?.paging.totalPage / 10)}
                />
              </div>
            )}
            <div className="is-best-box">
              <Link
                className={viewType === "best" ? "is-best" : "is-all"}
                onClick={() => {
                  setViewType("best");
                }}
                to={`/channel/${channelCode}/best`}
              >
                인기글
              </Link>
              <Link
                className={viewType === "all" ? "is-best" : "is-all"}
                onClick={() => {
                  setViewType("all");
                }}
                to={`/channel/${channelCode}/best`}
              >
                전체글
              </Link>
            </div>
            <Search
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              searchTarget={searchTarget}
              setSearchTarget={setSearchTarget}
              onSubmit={searchSubmit}
              isPost={true}
            />
          </div>
        </div>
      </div>
      {channel?.host.userEmail == user.userEmail && (
        <Link to={`/update/${channelCode}`}>채널수정</Link>
      )}
    </>
  );
};
export default ChannelDetail;
