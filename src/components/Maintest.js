import styled from "styled-components";

const StyledMainTest = styled.main`
font-family: "Pretendard Variable";
    font-style: normal;
    font-weight: 600;
  background-color: white;
   padding-top:55px;
  width: 100%;
  .main-content{
  display:flex;
  
    flex-direction: column;
    justify-content: center;
    align-items: center;
  padding-top:55px;

  .sub-title{

  margin-bottom:1rem;

  font-size:2rem;

      color: #333;
      font-weight: 900;
      text-align:center;
  }
      .community-list{
    
      justify-content: center;
    align-items: center;
      display:flex;
       flex-wrap: wrap;
      
      background:white;
      .community-name{
       
      font-size: 2rem;
    color: #000;
    font-weight: 900;
    margin-bottom:2rem;
    }
    .community-text{
   
    .type{
    width:60px;
    
    text-align: center;
    border: 1px solid black;
    background: black;
    color: white;
    border-radius: 10px;
    }
    .time{
    width:60px;
    }
    a{
    line-height: 2; 
    display:flex;
    justify-content: space-between;
    margin-bottom: 10px;
    
  
    }
    span{
    font-size:0.9rem;
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", arial, 굴림, Gulim, sans-serif;
    color: gray;
    width:70%;
    overflow: hidden; 
   text-overflow: ellipsis;
   text-wrap:nowrap;
   display:block;
}
    }
      
      
      width:80%;
      li{
        padding:2rem;
      margin:0.5rem;
      border-radius: 20px;
      background: #f4f4f4;
      width:40%;
      height: 400px;
      
    
            }
      }
            
  }
`;
const Maintest = () => {
  return (
    <StyledMainTest>
      <div className="main">
          <div className="main-content">
            <div className="sub-title">
            OUR COMMUNITY
            </div>
            <ul className="community-list">
              <li>
                <a>
                <div className="community-box">
                <div className="community-text">
                 <div className="community-name">원피스 갤러리</div>
                 <a><p className="type">정보</p><span>아이콘은 활동 포인트를 통해 무료로 구매할 수 있으며, 탈퇴/강제탈퇴 시 모든 포인트 및 아이콘이 삭제됩니다.</span><p className="time">1분전</p></a>
                 <a><p className="type">일반</p><span>작성일 기준으로 3일이 지난 글에는 댓글을 작성해도 포인트가 부여되지 않습니다</span><p className="time">3분전</p></a>
                 <a><p className="type">유머</p><span> 포인트 획득을 위해 도배 등 커뮤니티 룰을 어길 경우, 통보없이 삭제 및 아이디 차단이 될 수 있습니다.</span><p className="time">7분전</p></a>
                 <a><p className="type">정보</p><span>[이벤트]는 특정 이벤트에 선정된 분들만 무료로 구매할 수 있습니다.</span><p className="time">10분전</p></a>
                 <a><p className="type">정보</p><span>✔ 본인의 포인트 내역은 마이페이지에서 확인할 수 있습니다.</span><p className="time">15분전</p></a>
                </div>
                </div>
                </a>
                </li>
              <li><a><div></div></a></li>
              <li><a><div></div></a></li>
              <li><a><div></div></a></li>
            </ul>
            
          </div>

       
      </div>
    </StyledMainTest>
  );
};
export default Maintest;
