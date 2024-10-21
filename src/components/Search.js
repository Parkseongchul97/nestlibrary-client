import React, { useRef, useState } from "react";

const Search = ({
  searchKeyword,
  setSearchKeyword,
  searchTarget,
  setSearchTarget,
  onSubmit,
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
        {/*이것도 나중에 파라미터 객체로 받아서 반복문 돌린후 어디서든 사용?*/}
        <option value="title">글 제목 검색</option>
        <option value="content">글 내용 검색</option>
        <option value="user">닉네임 검색</option>
      </select>
      <button onClick={onSubmit}>검색</button>
    </div>
  );
};

export default Search;
