import Header from "./Header";
import Footer from "./Footer";
import { allChannel } from "../api/channel";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [channelList, setChannelList] = useState([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const chanList = useCallback(async (page, keyword) => {
    const result = await allChannel(page, keyword);
    if (page === 1 && keyword == "") {
      setChannelList(
        result.data.map((channel) => ({
          ...channel,
          allPost: channel.allPost || [],
        }))
      );
    } else if (page > 1 && keyword == "") {
      setChannelList(() => [
        ...result.data.map((channel) => ({
          ...channel,
          allPost: channel.allPost || [],
        })),
      ]);
    } else if (page >= 1 && keyword != "") {
      setChannelList((prev) => [
        ...prev,
        ...result.data.map((channel) => ({
          ...channel,
          allPost: channel.allPost || [],
        })),
      ]);
    }
  }, []);
  /*
  useEffect(() => {
    chanList();
  }, [channelList.length]);
*/
  console.log(page);
  useEffect(() => {
    chanList(page, keyword);
  }, [keyword, page]);

  const onSearch = (keyword) => {
    // 키워드를 받음
    setPage(1); // 검색하면 1페이지로
    setChannelList([]); // 비디오들도 초기상태로 해놓고 다시 불러야함
    setKeyword(keyword);
  };

  return (
    <>
      <Header onSearch={onSearch} />
      <Outlet context={{ channelList, setPage }} />
      <Footer />
    </>
  );
};
export default Layout;
