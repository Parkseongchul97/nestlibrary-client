import { useEffect, useState } from "react";
import { channelAnnouncement } from "../../api/channel";
import PostListComponent from "./PostListComponent";

const AnnouncementPost = ({ channelCode, setIsOpenDetail, isOpenDetail }) => {
  const [announcementPosts, setAnnouncementPosts] = useState([]);
  const fetch = async () => {
    const response = await channelAnnouncement(channelCode);
    setAnnouncementPosts(response.data);
  };

  useEffect(() => {
    fetch();
  }, [channelCode]);
  useEffect(() => {
    fetch();
  }, []);
  const displayedPosts = [...announcementPosts];
  for (let i = displayedPosts.length; i < 3; i++) {
    displayedPosts.push(null);
  }

  return (
    <div className="post-announcement">
      {displayedPosts.map((post, index) =>
        post ? (
          <PostListComponent
            isAnnouncement={true}
            post={post}
            key={post.postCode}
            channelCode={channelCode}
            channelTagCode={post.channelTag.channelTagCode}
            isOpenDetail={isOpenDetail}
            setIsOpenDetail={setIsOpenDetail}
          />
        ) : (
          <div className="none-announcement-post" key={index}>
            <div className="none-announcement-text">공지가 없습니다.</div>
          </div>
        )
      )}
    </div>
  );
};
export default AnnouncementPost;
