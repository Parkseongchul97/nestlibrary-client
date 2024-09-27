import styled from "styled-components";

const StyledFooter = styled.footer`
  .footer {
    width: 100%;
    height: 200px;
    background-color: black;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Bebas Neue", sans-serif;
    .service-info {
      width: 50%;
    }
    .service-info-detail {
      width: 35%;
      line-height: 2;
    }
    .service-logo {
      font-size: 4rem;

      width: 50%;
      height: 70%;
    }
    .member-info a {
      color: beige;
      line-height: 2;
      font-size: 1.3rem;
    }
    .contact {
      font-size: 2rem;
      color: beige;
    }
  }
`;
const Footer = () => {
  return (
    <StyledFooter>
      <div className="footer">
        <div className="service-info">
          <div className="service-logo">NEST LIBRARY</div>
          <div className="service-info-detail">
            Nest Library | 서울시 강남구 테헤란로 99길 37, 2층{" "}
            <div>Since : 2024.09.27</div>
          </div>
        </div>
        <div className="member-info">
          <ul>
            <li className="contact">Contact </li>
            <a href="https://github.com/Parkseongchul97">
              <li>박성철 | https://github.com/Parkseongchul97</li>
            </a>
            <a href="https://github.com/jjang1129">
              <li>장성일 | https://github.com/jjang1129</li>
            </a>
          </ul>
        </div>
      </div>
    </StyledFooter>
  );
};
export default Footer;
