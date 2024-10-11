const KakaoLogin = () => {
  const Rest_api_key = "376abff8d82b23a39e57639e3f0760ad"; //REST API KEY
  const redirect_uri = "http://localhost:3000/kakao"; //Redirect URI

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
  const loginPage = () => {
    window.location.href = kakaoURL;
  };
  return (
    <>
      <button onClick={loginPage}>카카오 로그인</button>
    </>
  );
};
export default KakaoLogin;
