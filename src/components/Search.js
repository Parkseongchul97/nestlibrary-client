import { useState } from "react";
import "../assets/search.scss";
const Search = ({
  searchKeyword,
  setSearchKeyword,
  searchTarget,
  setSearchTarget,
  onSubmit,
  isPost,
}) => {
  // 조합문자인지 아닌지
  const [isComposing, setIsComposing] = useState(false);

  const enterSearchSubmit = (e) => {
    if ((e.code === "Enter" || e.code === "NumpadEnter") && !isComposing) {
      onSubmit();
    }
  };
  return (
    <div className="search">
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="2글자 이상 입력하세요"
        onKeyDown={enterSearchSubmit}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
      />
      {/*2번 호출되는 상황 또발생 */}
      <select
        value={searchTarget}
        onChange={(e) => setSearchTarget(e.target.value)}
      >
        {!isPost ? (
          <>
            <option value="title">쪽지 제목 검색</option>
            <option value="user">발/수신자 찾기</option>
          </>
        ) : (
          <>
            <option value="title">글 제목 검색</option>
            <option value="content">글 내용 검색</option>
            <option value="user">닉네임 검색</option>
          </>
        )}
      </select>
      <button onClick={onSubmit}>검색</button>
    </div>
  );
};

export default Search;
