import React from "react";

const Search = ({
  searchKeyword,
  setSearchKeyword,
  searchTarget,
  setSearchTarget,
  onSubmit,
  isPost,
}) => {
  const enterSearchSubmit = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      if (searchKeyword.length <= 1) {
        alert("2글자 이상 입력해야 합니다!");
        return;
      }
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
        onKeyUp={(e) => enterSearchSubmit(e)}
      />
      {/*2번 호출되는 상황 또발생 */}
      <select
        value={searchTarget}
        onChange={(e) => setSearchTarget(e.target.value)}
      >
        {!isPost ? (
          <>
            <option value="channel">채널 이름 검색</option>
            <option value="host">채널 호스트 검색</option>
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
