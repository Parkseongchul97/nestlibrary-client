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
import PostListComponent from "../components/post/PostListComponent";
import "../assets/channelDetail.scss";
import "../assets/main.scss";
import Page from "../components/Page";
import Search from "../components/Search";
import PostDetail from "../components/post/PostDetail";
import UserMenu from "../components/user/UserMenu";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import AnnouncementPost from "../components/post/AnnouncementPost";
import { loginUserChannelGrade } from "../api/management";
const ChannelDetail = () => {
  const { user, token } = useAuth(); // 로그인 유저
  const { channelCode, channelTagCode } = useParams();
  const [channel, setChannel] = useState(null); // 채널정보
  const [posts, setPosts] = useState([]); // 채널 내의 게시판 정보
  const [viewType, setViewType] = useState("all");
  const queryClient = useQueryClient();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [isOpenUser, setIsOpenUser] = useState(false);

  let page = query.get("page") || 1;
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
  const [searchTarget, setSearchTarget] = useState("title"); // 기본 검색 대상: 제목
  const { postCode } = useParams();
  const [loginUserGrade, setloginUserGrade] = useState(null); //로그인 유저의 권한

  const loginGrade = async () => {
    const response = await loginUserChannelGrade(channelCode);
    setloginUserGrade(response.data);
  };
  useEffect(() => {
    if (channelCode !== undefined && channelCode !== null && token !== null) {
      loginGrade();
    }
  }, [token, channelCode]);
  const fetch = async () => {
    setPosts([]);
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

  const userMenuToggle = (channelCode) => {
    if (isOpenUser === channelCode) {
      setIsOpenUser(null);
    } else {
      setIsOpenUser(channelCode);
    }
  };
  useEffect(() => {
    fetch();
  }, [channelCode, channelTagCode, page, viewType, postCode]);

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
            <div className="channel-header-left">
              <img
                className="channel-img"
                src={
                  channel?.channelImgUrl != null
                    ? "http://192.168.10.51:8083/channel/" +
                      channelCode +
                      "/" +
                      channel?.channelImgUrl
                    : "http://192.168.10.51:8083/%EA%B8%B0%EB%B3%B8%EB%8C%80%EB%AC%B8.jpg"
                }
              />
              <div className="channel-header-left-box">
                <Link to={"/channel/" + channelCode}>
                  {channel?.channelName}
                </Link>

                <p>{channel?.channelInfo}</p>
                <p>Since : {channel?.channelCreatedAt.split("T")[0]}</p>
              </div>
            </div>

            <div className="channel-header-right">
              <div className="channel-header-auth">
                {(loginUserGrade?.managementUserStatus === "host" ||
                  loginUserGrade?.managementUserStatus === "admin") && (
                  <Link className="write-btn" to={`/update/${channelCode}`}>
                    채널수정
                  </Link>
                )}
                <p>구독자수 {channel?.favoriteCount}</p>
                {!token ? null : data?.data ? (
                  <FaHeart
                    onClick={removeSubSubmit}
                    size={"2rem"}
                    style={{ color: "red" }}
                  />
                ) : (
                  <FaRegHeart
                    onClick={addSubSubmit}
                    size={"2rem"}
                    style={{ color: "red" }}
                  />
                )}

                {token && (
                  <Link
                    className="write-btn"
                    to="/write"
                    state={{ isChannelCode: channelCode }}
                  >
                    글쓰기
                  </Link>
                )}
              </div>
              <UserMenu
                user={channel?.host}
                channelCode={channel?.channelCode}
                isOpenUser={isOpenUser === channelCode}
                userMenuToggle={() => userMenuToggle(channelCode)}
              />
            </div>
          </div>
          {postCode && (
            <PostDetail
              postCode={postCode}
              page={page}
              loginUserGrade={loginUserGrade}
            />
          )}
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
                  {channelTag.channelTagName === "공지" && "📢"}
                  {channelTag.channelTagName}
                </Link>
              ))}
            </div>
            <div className="post-box">
              <div className="post-box-header">
                <div className="header-tag">태그</div>
                <div className="header-title">제목</div>
                <div className="header-auth">글쓴이</div>
                <div className="header-day">작성일</div>
                <div className="header-view">조회</div>
                <div className="header-like">추천</div>
                <div className="header-comment">댓글</div>
              </div>
              <AnnouncementPost
                channelCode={channelCode}
                isOpenDetail={isOpenDetail}
                setIsOpenDetail={setIsOpenDetail}
              />
              {posts?.postList === undefined || posts?.postList === null ? (
                <div className="none-post-box">
                  <div>!</div>
                  <p>게시글이 없습니다.</p>
                </div>
              ) : (
                posts?.postList?.map((post) => (
                  <PostListComponent
                    page={page}
                    postCode={postCode}
                    post={post}
                    key={post?.postCode}
                    channelCode={channelCode}
                    channelTagCode={channelTagCode}
                    isOpenDetail={isOpenDetail}
                    setIsOpenDetail={setIsOpenDetail}
                  />
                ))
              )}
            </div>
            <div className="page-btn">
              <Link
                className={viewType === "best" ? "is-best" : "is-all"}
                onClick={() => {
                  setViewType("best");
                }}
                to={`/channel/${channelCode}/best`}
              >
                인기글
              </Link>
              {posts?.paging !== undefined && posts?.paging.totalPage !== 0 && (
                <Page
                  page={posts?.paging.page}
                  totalPages={Math.ceil(posts?.paging.totalPage / 10)}
                />
              )}
              <Link
                className={viewType === "all" ? "is-best" : "is-all"}
                onClick={() => {
                  setViewType("all");
                }}
                to={`/channel/${channelCode}`}
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
    </>
  );
};
export default ChannelDetail;
