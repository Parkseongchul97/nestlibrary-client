import "../assets/footer.scss";
import { GoMoveToTop, GoMoveToBottom } from "react-icons/go";
const Footer = () => {
  return (
    <>
      <div className="footer">
        <div className="service-info">
          <div className="service-logo">NEST LIBRARY</div>
          <div className="service-info-detail">
            Nest Library | 서울특별시 강남구 테헤란로 14길 6 남도빌딩 4F{" "}
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
      <div id="moving-btn-box">
        <button
          className="btn-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <GoMoveToTop />
        </button>
        <button
          className="btn-bottom"
          onClick={() =>
            window.scrollTo({
              top: document.documentElement.scrollHeight - 500,
              behavior: "smooth",
            })
          }
        >
          <GoMoveToBottom />
        </button>
      </div>
    </>
  );
};
export default Footer;
