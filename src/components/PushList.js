import { Link } from "react-router-dom";
import TimeFormat from "./TimeFormat";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { removePush } from "../api/push";
import "../assets/pushList.scss";
const PushList = ({ push }) => {
  const queryClient = useQueryClient();

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

  return (
    <div className="push-box">
      {push?.postCode !== undefined ? (
        <Link to={`post/${push.postCode}`} onClick={removeSubmit}>
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
