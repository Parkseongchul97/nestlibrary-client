import "../assets/main.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PostListComponent from "../components/PostListComponent";

import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addSub, checkSub, removeSub } from "../api/subscribe";
import UserMenu from "../components/UserMenu";

const Main = () => {
  const { channelList, setPage, subCheck } = useOutletContext();
  const { user, token } = useAuth();

  const queryClient = useQueryClient();

  const scroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      setPage((page) => page + 1);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscribe", channelList.map((channel) => channel.channelCode)],
    queryFn: () =>
      token
        ? Promise.all(
            channelList.map((channel) => checkSub(channel.channelCode))
          )
        : null,
    enabled: !!token,
  });
  // 구독
  const addSubMutation = useMutation({
    mutationFn: addSub,
    onSuccess: () => {
      queryClient.invalidateQueries(["subscribe"]);
    },
  });

  // 구독 취소
  const removeSubMutation = useMutation({
    mutationFn: removeSub,
    onSuccess: () => {
      queryClient.invalidateQueries(["subscribe"]);
    },
  });

  const addSubSubmit = (chanCode) => {
    if (token !== null) {
      const subContent = {
        userEmail: user.userEmail,
        channel: {
          channelCode: chanCode,
        },
      };
      addSubMutation.mutate(subContent);
    }
  };
  const removeSubSubmit = (managementCode) => {
    // 매니지먼트 코드 보내서 삭제
    removeSubMutation.mutate(managementCode);
  };

  // 랜더링 + 페이지 변화시마다 스크롤 이벤트 함수 생성 및 제거
  useEffect(() => {
    window.addEventListener("scroll", scroll);
    return () => {
      window.removeEventListener("scroll", scroll);
    };
  }, [setPage]);

  if (isLoading) return <>로딩</>;

  if (error) return <>에러</>;

  return (
    <div className="main-box">
      <div className="main">
        <div className="main-content">
          <div className="sub-title">OUR COMMUNITY</div>
          <ul className="channel-list">
            {channelList.map((channel, index) => (
              <li className="channel-box" key={channel?.channelCode}>
                <Link
                  to={`/channel/${channel?.channelCode}`}
                  className="channel-name"
                >
                  {channel?.channelName} 채널
                </Link>

                {token != null && data[index].data !== "" ? (
                  <>
                    <button
                      onClick={() =>
                        removeSubSubmit(data[index].data.managementCode)
                      }
                    >
                      구독취소
                    </button>
                  </>
                ) : (
                  <button onClick={() => addSubSubmit(channel?.channelCode)}>
                    구독
                  </button>
                )}

                {channel.allPost !== undefined &&
                channel.allPost.length !== 0 ? (
                  <div className="post-box">
                    {channel.allPost.map((post) => (
                      <PostListComponent post={post} key={post?.postCode} />
                    ))}
                  </div>
                ) : (
                  <div className="none-post-box">
                    <div>!</div>
                    <p>게시글이 없습니다.</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Main;
