import React from "react";

const Search = ({
  searchKeyword,
  setSearchKeyword,
  searchTarget,
  setSearchTarget,
  onSubmit,
}) => {
  const enterSearchSubmit = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      onSubmit();
    }
  };
  return (
    <div className="search">
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="검색어를 입력하세요"
        onKeyDown={(e) => enterSearchSubmit(e)}
      />
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
