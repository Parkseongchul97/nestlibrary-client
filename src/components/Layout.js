import Header from "./Header";
import Footer from "./Footer";
import { allChannel } from "../api/channel";
import { useEffect, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [channelList, setChannelList] = useState([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [subCheck, setSubCheck] = useState(0);

  const chanList = useCallback(async (page, keyword, subCheck) => {
    const result = await allChannel(page, keyword, subCheck);

    if (page == 1) {
      setChannelList(result.data);
    } else {
      setChannelList((prev) => [...prev, ...result.data]);
    }
  }, []);
  /*
  useEffect(() => {
    chanList();
  }, [channelList.length]);
*/
  console.log(page);
  console.log(channelList);
  useEffect(() => {
    chanList(page, keyword, subCheck);
  }, [keyword, page, subCheck]);

  const onSearch = (keyword) => {
    // 키워드를 받음
    setPage(1); // 검색하면 1페이지로
    setChannelList([]); // 비디오들도 초기상태로 해놓고 다시 불러야함
    setKeyword(keyword);
  };

  const onSub = () => {
    setPage(1); // 검색하면 1페이지로
    setChannelList([]); // 비디오들도 초기상태로 해놓고 다시 불러야함
    setSubCheck(1);
  };

  return (
    <>
      <Header onSearch={onSearch} onsub={onSub} />
      <Outlet context={{ channelList, setPage }} />
      <Footer />
    </>
  );
};
export default Layout;
