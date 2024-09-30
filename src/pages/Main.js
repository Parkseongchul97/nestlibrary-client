import "../assets/main.scss";
import styled from "styled-components";

const Maintest = () => {
  return (
    <div className="main">
      <div className="main-content">
        <div className="sub-title">OUR COMMUNITY</div>
        <ul className="community-list">
          <li>
            <a>
              <div className="community-box">
                <div className="community-text">
                  <div className="community-name">원피스 갤러리</div>
                  <a>
                    <p className="type">정보</p>
                    <span>
                      아이콘은 활동 포인트를 통해 무료로 구매할 수 있으며,
                      탈퇴/강제탈퇴 시 모든 포인트 및 아이콘이 삭제됩니다.
                    </span>
                    <p className="time">1분전</p>
                  </a>
                  <a>
                    <p className="type">일반</p>
                    <span>
                      작성일 기준으로 3일이 지난 글에는 댓글을 작성해도 포인트가
                      부여되지 않습니다
                    </span>
                    <p className="time">3분전</p>
                  </a>
                  <a>
                    <p className="type">유머</p>
                    <span>
                      {" "}
                      포인트 획득을 위해 도배 등 커뮤니티 룰을 어길 경우,
                      통보없이 삭제 및 아이디 차단이 될 수 있습니다.
                    </span>
                    <p className="time">7분전</p>
                  </a>
                  <a>
                    <p className="type">정보</p>
                    <span>
                      [이벤트]는 특정 이벤트에 선정된 분들만 무료로 구매할 수
                      있습니다.
                    </span>
                    <p className="time">10분전</p>
                  </a>
                  <a>
                    <p className="type">정보</p>
                    <span>
                      ✔ 본인의 포인트 내역은 마이페이지에서 확인할 수 있습니다.
                    </span>
                    <p className="time">15분전</p>
                  </a>
                </div>
              </div>
            </a>
          </li>
          <li>
            <a>
              <div></div>
            </a>
          </li>
          <li>
            <a>
              <div></div>
            </a>
          </li>
          <li>
            <a>
              <div></div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Maintest;
