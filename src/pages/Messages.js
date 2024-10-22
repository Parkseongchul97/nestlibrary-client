import { Link, useLocation } from "react-router-dom";
import "../assets/messages.scss";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  toMessage,
  fromMessage,
  allMessage,
  noOpenMessage,
} from "../api/message";
import Search from "../components/Search";
import MessageList from "../components/MessageList";
import Page from "../components/Page";
const Messages = () => {
  // const [messageList, setMessageList] = useState({}); // 쪽지 목록
  const queryClient = useQueryClient();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [isOpen, setIsOpen] = useState(0);
  let page = query.get("page") || 1;

  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
  const [searchTarget, setSearchTarget] = useState("title"); // 기본

  const [viewType, setViewType] = useState(""); // 전체냐 to냐 from이냐 구분

  // 메시지 데이터 가져오기
  // const fetch = async () => {
  //   // 검색어를 받아서 있으면
  //   let response;
  //   if (viewType === "to") {
  //     // 내가 받은
  //     response = await toMessage(page, searchTarget, searchKeyword);
  //   } else if (viewType === "from") {
  //     // 내가 보낸
  //     response = await fromMessage(page, searchTarget, searchKeyword);
  //   } else if (viewType === "all") {
  //     response = await allMessage(page, searchTarget, searchKeyword);
  //   } else {
  //     response = await noOpenMessage(page, searchTarget, searchKeyword);
  //   }
  //   console.log(response.data);
  //   setMessageList(response.data);
  // };
  const {
    data: messageList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messageList"],
    queryFn: () => {
      if (viewType === "to") {
        // 내가 받은
        if (searchTarget === undefined || searchKeyword === undefined) {
          return toMessage(page);
        } else {
          return toMessage(page, searchTarget, searchKeyword);
        }
      } else if (viewType === "from") {
        // 내가 보낸
        if (searchTarget === undefined || searchKeyword === undefined) {
          return fromMessage(page);
        } else {
          return fromMessage(page, searchTarget, searchKeyword);
        }
      } else if (viewType === "all") {
        // 전부
        if (searchTarget === undefined || searchKeyword === undefined) {
          return allMessage(page);
        } else {
          return allMessage(page, searchTarget, searchKeyword);
        }
      } else {
        if (searchTarget === undefined || searchKeyword === undefined) {
          return noOpenMessage(page);
        } else {
          return noOpenMessage(page, searchTarget, searchKeyword);
        }
      }
    },
  });
  const searchSubmit = () => {
    // 검색
    if (searchKeyword.length <= 1) {
      alert("2글자 이상 입력해야 합니다!");
      return;
    }
    query.set("page", 1);
    page = query.get("page") || 1;
    queryClient.invalidateQueries({ queryKey: ["messageList"] });
  };
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["messageList"] });
  }, [page, viewType]);

  if (isLoading) return <>로딩중...</>;
  if (error) return <>에러발생...</>;
  return (
    <div className="messages-box">
      <div className="messages-header">
        <Link className="messages-type" to="#" onClick={() => setViewType("")}>
          아직안본 메시지
        </Link>
        <Link
          className="messages-type"
          to="#"
          onClick={() => {
            setViewType("all");
            setSearchKeyword("");
          }}
        >
          모든 메시지
        </Link>
        <Link
          className="messages-type"
          to="#"
          onClick={() => {
            setViewType("to");
            setSearchKeyword("");
          }}
        >
          받은 메시지
        </Link>
        <Link
          className="messages-type"
          to="#"
          onClick={() => {
            setViewType("from");
            setSearchKeyword("");
          }}
        >
          보낸 메시지
        </Link>
        <Link className="messages-type" to="/message/write">
          쪽지 쓰기
        </Link>
      </div>
      <div className="message-main">
        {/*메세지 컴포넌트 출력*/}
        {messageList.data.messagesDTOList?.map((message) => (
          <>
            <MessageList
              message={message}
              key={message?.messagesCode}
              setIsOpen={setIsOpen}
              isOpen={isOpen}
            />
          </>
        ))}
      </div>
      {messageList.data.paging !== undefined &&
        messageList.data.paging.totalPage !== 0 && (
          <div className="page-btn">
            <Page
              page={messageList.data.paging.page}
              totalPages={Math.ceil(messageList.data.paging?.totalPage / 10)}
            />
          </div>
        )}
      <Search
        isPost={false}
        onSubmit={searchSubmit}
        searchKeyword={searchKeyword}
        searchTarget={searchTarget}
        setSearchKeyword={setSearchKeyword}
        setSearchTarget={setSearchTarget}
      />
    </div>
  );
};
export default Messages;
