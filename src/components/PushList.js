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
  };
  const postPaging = async () => {
    const result = await getPageNum(push.postCode);
    setPage(result.data);
  };
  useEffect(() => {
    postPaging();
    console.log("내 포스트 코드 : "+ push?.postCode + "내 페이지 : + " + page)
  }, []);

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
