import "../assets/userHelp.scss";

const UserHelp = () => {
  return (
    <div className="find-box">
      <div className="logo">Nest Library</div>
      <span className="box-text">
        비밀번호를 찾고자하는 아이디를 입력해주세요.
      </span>
      <input className="box-input" type="text" placeholder="아이디" />
      <button className="box-button">다음</button>
    </div>
  );
};

export default UserHelp;
