import Header from "./Header";
import Footer from "./Footer";
import { allChannel } from "../api/channel";
import { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const currentUrl = window.location.href;

  const [channelList, setChannelList] = useState([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [subCheck, setSubCheck] = useState(0);
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  const chanList = useCallback(async (page, keyword) => {
    const result = await allChannel(page, keyword);

    if (subCheck == 0) {
      if (page == 1) {
        setChannelList(result.data);
      } else {
        setChannelList((prev) => [...prev, ...result.data]);
      }
    }
  }, []);

  useEffect(() => {
    chanList(page, keyword, subCheck);
  }, [keyword, page, subCheck]);

  const onSearch = (keyword) => {
    setPage(1);
    setChannelList([]);
    setKeyword(keyword);
    setIsSearch(!isSearch);
    if (currentUrl != "http://localhost:3000/") navigate(`/`);
  };

  const onSub = () => {
    if (localStorage.getItem("token") != null) {
      setSubCheck(1);
      setPage(1);
    } else {
      alert("로그인 후 이용해주세요");
    }
  };

  const all = () => {
    setSubCheck(0);
    setPage(1);
  };

  return (
    <>
      <Header onSearch={onSearch} onsub={onSub} all={all} />
      <Outlet context={{ channelList, setPage, subCheck }} />
      <Footer />
    </>
  );
};
export default Layout;
