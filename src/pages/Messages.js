import { Link, useLocation } from "react-router-dom";
import "../assets/messages.scss";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  toMessage,
  fromMessage,
  allMessage,
  noOpenMessage,
  removeMessage,
} from "../api/message";
import Search from "../components/Search";
import MessageList from "../components/MessageList";
import Page from "../components/Page";
const Messages = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [isOpen, setIsOpen] = useState(0);
  let page = query.get("page") || 1;
  const [allCheck, setAllCheck] = useState(false);
  const [checkedList, setCheckedList] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
  const [searchTarget, setSearchTarget] = useState("title"); // 기본
  const [newCheckList, setNewCheckList] = useState([]);
  const [viewType, setViewType] = useState(""); // 전체냐 to냐 from이냐 구분

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
    refetchInterval: 1000,
  });
  const removeMutation = useMutation({
    mutationFn: removeMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messageList"] });
    },
  });
  const deleteSubmit = () => {
    for (const code of checkedList) {
      console.log(code);
      removeMutation.mutate(code);
    }
  };

  const AllListAdd = () => {
    if (messageList !== undefined) {
      // 리스트들이 다올라오면
      const ckList = [];
      for (const m of messageList.data.messagesDTOList) {
        const messageCode = m?.messagesCode;
        // 기존 checkedList에 없으면 추가
        if (!checkedList.includes(messageCode)) {
          ckList.push(messageCode);
        }
      }
      setNewCheckList(ckList);
    }
  };
  const AllListRemove = () => {
    setNewCheckList([]);
    setCheckedList([]);
    setAllCheck(false);
  };
  useEffect(() => {
    setCheckedList(...checkedList, newCheckList);
  }, [newCheckList]);

  useEffect(() => {
    if (allCheck) {
      AllListAdd();
    } else {
      AllListRemove();
    }
  }, [allCheck]);
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
    <div className="page-box">
      <div className="message-list-box">
        <div className="messages-header">
          <Link
            className="messages-type"
            to="#"
            onClick={() => {
              setViewType("");
              AllListRemove();
            }}
          >
            아직안본 메시지
          </Link>
          <Link
            className="messages-type"
            to="#"
            onClick={() => {
              setViewType("all");
              AllListRemove();
            }}
          >
            모든 메시지
          </Link>
          <Link
            className="messages-type"
            to="#"
            onClick={() => {
              setViewType("to");
              AllListRemove();
            }}
          >
            받은 메시지
          </Link>
          <Link
            className="messages-type"
            to="#"
            onClick={() => {
              setViewType("from");
              AllListRemove();
            }}
          >
            보낸 메시지
          </Link>
          <Link className="messages-type" to="/message/write">
            쪽지 쓰기
          </Link>
        </div>
        <div className="message-main-box">
          모두선택
          <input
            type="checkbox"
            checked={allCheck}
            onClick={() => {
              setAllCheck(!allCheck);
            }}
          />
          {/*메세지 컴포넌트 출력*/}
          {messageList.data === undefined ||
          messageList.data.messagesDTOList.length === 0 ? (
            <div className="none-message-box">
              <div>!</div>
              <p>쪽지가 없습니다.</p>
            </div>
          ) : (
            messageList.data.messagesDTOList?.map((message) => (
              <MessageList
                message={message}
                key={message?.messagesCode}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                isChecked={allCheck}
                setCheckedList={setCheckedList}
                checkedList={checkedList}
              />
            ))
          )}
        </div>
        {messageList.data.paging !== undefined &&
          messageList.data.paging.totalPage !== 0 && (
            <div className="page-btn">
              <Page
                page={messageList.data.paging.page}
                totalPages={Math.ceil(messageList.data.paging?.totalPage / 10)}
                pageBtnOnClick={AllListRemove}
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
      <button onClick={deleteSubmit}>삭제</button>
    </div>
  );
};
export default Messages;
