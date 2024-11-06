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
import MessageList from "../components/messages/MessageList";
import Page from "../components/Page";
import MessageWrite from "../components/messages/MessageWrite";
const Messages = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [isOpen, setIsOpen] = useState(0);
  let page = query.get("page") || 1;
  const [allCheck, setAllCheck] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [toUsers, setToUsers] = useState({
    email: "",
    nickname: "",
  });

  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
  const [searchTarget, setSearchTarget] = useState("title"); // 기본
  const [newCheckList, setNewCheckList] = useState([]);
  const [viewType, setViewType] = useState("open"); // 전체냐 to냐 from이냐 구분
  const [isOpenUser, setIsOpenUser] = useState(null);
  const [isOpenMessage, setIsOpenMessage] = useState(false);
  const userMenuToggle = (code) => {
    if (isOpenUser === code) {
      setIsOpenUser(null);
    } else {
      setIsOpenUser(code);
    }
  };
  const openDetail = (code) => {
    if (isOpen === code) {
      setIsOpen(0);
    } else {
      setIsOpen(code);
    }
  };
  // 쪽지 열었을때 열린 쪽지 div 색 변경, 다른 탭 눌렀을때 기존 열린 쪽지 닫히게
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
  const removeMutation = useMutation({
    mutationFn: removeMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messageList"] });
    },
  });
  const deleteSubmit = () => {
    for (const code of checkedList) {
      removeMutation.mutate(code);
    }
    setAllCheck(false);
  };

  const AllListAdd = () => {
    if (messageList !== undefined) {
      // 리스트들이 다올라오면

      const ckList = [];
      for (const m of messageList.data.messagesDTOList) {
        const messageCode = m?.messagesCode;
        ckList.push(messageCode);
      }
      setNewCheckList(ckList);
      setAllCheck(true);
    }
  };
  const AllListRemove = () => {
    setNewCheckList([]);
    setCheckedList([]);
    setAllCheck(false);
  };
  useEffect(() => {
    if (viewType === "open") {
      if (!(isOpen > 1)) {
        queryClient.invalidateQueries({ queryKey: ["messageList"] });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    setCheckedList(newCheckList);
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
    if (viewType === "open") {
      if (isOpen > 0) {
        return;
      }
    }
    queryClient.invalidateQueries({ queryKey: ["messageList"] });
  }, [page, viewType, isOpen]);

  useEffect(() => {
    if (
      messageList != undefined &&
      messageList?.data?.messagesDTOList.length !== 0
    ) {
      if (checkedList.length === messageList?.data?.messagesDTOList?.length) {
        setAllCheck(true);
      } else if (
        checkedList.length === 0 &&
        messageList?.data?.messagesDTOList?.length !== 0
      ) {
        setAllCheck(false);
      }
    }
  }, [checkedList]);
  if (isLoading) return <>로딩중...</>;
  if (error) return <>에러발생...</>;
  return (
    <div className="message-big-box">
      <Link to="/messages" className="message-header">
        쪽지함
      </Link>
      <div className="message-container">
        <div className="message-list-box">
          <div className="side-box">
            <div className="messages-side">
              <div
                className="writer"
                onClick={() => {
                  setIsOpenMessage(true);
                  setIsOpen(0);
                }}
              >
                쪽지 쓰기
              </div>

              <Link
                className={
                  viewType === "open"
                    ? "messages-selected-type"
                    : "messages-type"
                }
                to="#"
                onClick={() => {
                  setViewType("open");
                  AllListRemove();
                }}
              >
                안읽은 쪽지
              </Link>

              <Link
                className={
                  viewType === "to" ? "messages-selected-type" : "messages-type"
                }
                to="#"
                onClick={() => {
                  setViewType("to");
                  AllListRemove();
                }}
              >
                받은 쪽지
              </Link>
              <Link
                className={
                  viewType === "from"
                    ? "messages-selected-type"
                    : "messages-type"
                }
                to="#"
                onClick={() => {
                  setViewType("from");
                  AllListRemove();
                }}
              >
                보낸 쪽지
              </Link>
            </div>
          </div>
          <div className="messages-right">
            <div className="message-main-box">
              <div className="message-main-header">
                <div className="message-main-header-left">
                  {messageList.data === undefined ||
                    (messageList.data.messagesDTOList.length !== 0 && (
                      <div className="check-box">
                        <input
                          type="checkbox"
                          checked={allCheck}
                          onClick={() => {
                            setAllCheck(!allCheck);
                          }}
                        />
                      </div>
                    ))}
                  <div className="messages-header-title">제목</div>
                </div>
                <div className="messages-header-user">
                  {viewType === "from" ? "받은사람" : "보낸사람"}
                </div>
                <div className="messages-header-time">시간</div>
              </div>
              {/*메세지 컴포넌트 출력*/}
              {messageList.data === undefined ||
              messageList.data.messagesDTOList.length === 0 ? (
                <div className="none-message-box">
                  <div>!</div>
                  <p>쪽지가 없습니다.</p>
                </div>
              ) : (
                <div className="messages-box">
                  {messageList.data.messagesDTOList?.map((message) => (
                    <MessageList
                      openDetail={openDetail}
                      message={message}
                      key={message?.messagesCode}
                      setIsOpen={setIsOpen}
                      isOpen={isOpen}
                      isChecked={allCheck}
                      setCheckedList={setCheckedList}
                      checkedList={checkedList}
                      viewType={viewType}
                      isOpenUser={isOpenUser}
                      setIsOpenMessage={setIsOpenMessage}
                      userMenuToggle={userMenuToggle}
                      setToUser={setToUsers}
                    />
                  ))}
                </div>
              )}
            </div>
            {messageList.data.paging !== undefined &&
              messageList.data.paging.totalPage !== 0 && (
                <div className="messages-page-btn">
                  <div className="side-bottom">
                    <div className="delete" onClick={deleteSubmit}>
                      삭제
                    </div>
                  </div>
                  <Page
                    page={messageList.data.paging.page}
                    totalPages={Math.ceil(
                      messageList.data.paging?.totalPage / 10
                    )}
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
        </div>

        {isOpenMessage && (
          <MessageWrite
            isOpenMessage={isOpenMessage}
            setIsOpenMessage={setIsOpenMessage}
            setViewType={setViewType}
            toUser={{
              toUser: {
                email: toUsers.email,
                nickname: toUsers.nickname,
              },
            }}
          />
        )}
      </div>
    </div>
  );
};
export default Messages;
