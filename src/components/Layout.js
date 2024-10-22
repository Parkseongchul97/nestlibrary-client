import Header from "./Header";
import Footer from "./Footer";
import { allChannel, subChannel } from "../api/channel";
import { useEffect, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [channelList, setChannelList] = useState([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [subCheck, setSubCheck] = useState(0);

  const chanList = useCallback(async (page, keyword, subCheck) => {
    const result = await allChannel(page, keyword);
    console.log("섭체크 " + subCheck);
    if (subCheck == 0) {
      if (page == 1) {
        setChannelList(result.data);
      } else {
        setChannelList((prev) => [...prev, ...result.data]);
      }
    } else if (subCheck == 1) {
      const result2 = await subChannel(page, keyword);

      if (page == 1) {
        setChannelList(result2.data);
      } else {
        setChannelList((prev) => [...prev, ...result2.data]);
      }
    }
  }, []);

  useEffect(() => {
    chanList(page, keyword, subCheck);
    console.log(page);
  }, [keyword, page, subCheck]);

  const onSearch = (keyword) => {
    setPage(1);
    setChannelList([]);
    setKeyword(keyword);
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
