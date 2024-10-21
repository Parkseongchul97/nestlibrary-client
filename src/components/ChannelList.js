import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { addSub, checkSub, removeSub } from "../api/subscribe";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const ChannelList = ({ listTitle, subList }) => {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();
  const [channelCode, setChannelCode] = useState();
  const [isOpen, setIsOpen] = useState(false);
  // 오픈버튼, 인증된 유저가 볼수있는가 , 리스트의 이름
  // const [subChannel, setSubChannel] = useState(null); // 채널정보

  // 구독
  const addSubMutation = useMutation({
    mutationFn: addSub,
    onSuccess: () => {
      queryClient.invalidateQueries(["subscribe", channelCode]);
    },
  });
  const { subCheck, isLoading, error } = useQuery({
    queryKey: ["subscribe", channelCode],
    queryFn: () => (token ? checkSub(channelCode) : null),
    enabled: !!token,
  });

  // 구독 취소
  const removeSubMutation = useMutation({
    mutationFn: removeSub,
    onSuccess: () => {
      queryClient.invalidateQueries(["subscribe", channelCode]);
    },
  });
  const addSubSubmit = () => {
    if (token !== null) {
      const subContent = {
        userEmail: user.userEmail,
        channelCode: channelCode,
      };
      addSubMutation.mutate(subContent);
    }
  };
  console.log(subList);
  console.log(channelCode);
  const removeSubSubmit = () => {
    // 매니지먼트 코드 보내서 삭제
    removeSubMutation.mutate(subCheck.data?.managementCode);
  };

  return (
    <div className="channel-list">
      <div className="channel-list-header" onClick={() => setIsOpen(!isOpen)}>
        {listTitle} {/*전체 채널or 구독중인채널or 검색 결과 그런식으로?*/}
      </div>
      {isOpen && (
        <div className="list-content">
          {subList.length !== 0 ? (
            subList.data.map((channel) => (
              <Link to={"/channel/" + channel?.channelCode} key={channel?.id}>
                <div className="channel-box">
                  {setChannelCode(channel.channelCode)}
                  {queryClient.invalidateQueries(["subscribe", channelCode])}
                  <div>{channel.channelName} 채널</div>
                  <UserMenu user={channel.host} />
                  <div className="sub-btn-box">
                    {!token ? null : subCheck?.data ? (
                      <button onClick={removeSubSubmit}>구독취소</button>
                    ) : (
                      <button onClick={addSubSubmit}>구독</button>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div>해당하는 채널이 없습니다!!</div>
          )}
        </div>
      )}
    </div>
  );
};
export default ChannelList;
