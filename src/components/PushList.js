import { Link } from "react-router-dom";
import TimeFormat from "./TimeFormat";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { removePush } from "../api/push";
import { useState, useEffect } from "react";
import "../assets/pushList.scss";
import { getPageNum } from "../api/post";
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
    if (page === -1 || undefined) {
      alert("삭제된 게시글입니다!");
    }
  };
  const postPaging = async () => {
    const result = await getPageNum(push.postCode);
    setPage(result.data);
  };
  useEffect(() => {
    postPaging();
  }, [push]);

  return (
    <div className="push-box">
      {push?.postCode !== undefined ? (
        <Link
          to={`/channel/${push.channelCode}/post/${push.postCode}?page=${page}`}
          onClick={removeSubmit}
        >
          {push.pushMassage}
          <TimeFormat time={push.pushCreatedAt} />
        </Link>
      ) : page === undefined || page === -1 ? (
        <p onClick={removeSubmit}>삭제된 게시글 입니다</p>
      ) : (
        <p onClick={removeSubmit}>
          {push.pushMassage}
          <TimeFormat time={push.pushCreatedAt} />
        </p>
      )}
      <button onClick={removeSubmit}>알림끄기</button>
    </div>
  );
};
export default PushList;
