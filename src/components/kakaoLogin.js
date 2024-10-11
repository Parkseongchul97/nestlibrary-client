const KakaoLogin = () => {
  const Rest_api_key = "376abff8d82b23a39e57639e3f0760ad"; //REST API KEY
  const redirect_uri = "http://localhost:3000/kakao"; //Redirect URI

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
  const loginPage = () => {
    window.location.href = kakaoURL;
  };
  return (
    <>
      <div className="arther-login">
        <img
          className="arther-login-btn"
          src="http://192.168.10.51:8083/kakao_login_medium_narrow.png"
          onClick={loginPage}
        />
        <img
          className="arther-login-btn"
          src="http://192.168.10.51:8083/btnG_%EC%99%84%EC%84%B1%ED%98%95.png"
        />
      </div>
    </>
  );
};
export default KakaoLogin;
