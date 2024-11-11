import { Link } from "react-router-dom";
import TimeFormat from "./TimeFormat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePush } from "../api/push";
import { useState, useEffect } from "react";
import "../assets/pushList.scss";
import { getPageNum } from "../api/post";

import { RiDeleteBin6Fill } from "react-icons/ri";
const PushList = ({ push }) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState();
  const removeMutation = useMutation({
    mutationFn: removePush,
    enabled: !!push.pushCode,
    onSuccess: () => {
      queryClient.invalidateQueries(["pushCount"]);
    },
  });
  const removeSubmit = () => {
    removeMutation.mutate(push.pushCode);
  };
  const postPaging = async () => {
    const result = await getPageNum(push.postCode);
    setPage(result.data);
  };
  useEffect(() => {
    console.log(push);
    postPaging();
  }, [push]);

  return (
    <div className="push-box">
      {push?.postCode !== undefined && push.postCode !== 0 ? (
        <Link
          to={`/channel/${push.channelCode}/post/${push.postCode}?page=${page}`}
          onClick={removeSubmit}
        >
          {push.pushMassage}
          <TimeFormat time={push.pushCreatedAt} />
        </Link>
      ) : push.postCode === 0 && (page === undefined || page === -1) ? (
        <Link to={`/channel/${push.channelCode}`} onClick={removeSubmit}>
          {push.pushMassage}
          <TimeFormat time={push.pushCreatedAt} />
        </Link>
      ) : (
        <p onClick={removeSubmit}>삭제된 게시글 입니다</p>
      )}
      <RiDeleteBin6Fill onClick={removeSubmit} />
    </div>
  );
};
export default PushList;
