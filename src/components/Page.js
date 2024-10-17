import { useState } from "react";
import "../assets/page.scss";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Page = ({ page, totalPages }) => {
  // 페이지 현제 페이지 토탈은 총 몇페이지인지
  const pageCount = 10; // 화면에 보이는 페이지 숫자
  let num = totalPages % 10; // 페이지 좌표 한계점 ex 토탈 173개의 개시글이면 토탈 18p? 2번째부턴 8페이지가끝
  const [start, setStart] = useState(1); // 시작점

  const prevClick = () => {
    // 10단위 이전페이지
    if (start > 10) {
      // 11페이지 스타팅 이상이면
      setStart(start - 10);
    }
  };

  const nextClick = () => {
    // 10단위 다음페이지
    if (start + pageCount <= totalPages) {
      // 남은페이지가 있으면 현재 +10
      setStart(start + pageCount);
      // 11페이지로 스타팅을 바꿈
    }
    console.log(start);
  };

  const lastPage = () => {
    // 맨마지막 좌표 페이지로
    if (num == 0) {
      // 값이 딱떨어지는 페이지 숫자라면
      setStart(totalPages - 9);
      // 바로 마지막 페이지로
    } else {
      setStart(totalPages - (num - 1));
    }
    console.log(start);
  };

  return (
    <div className="paging">
      <ul className="paging-number">
        {(totalPages > 10 || start > 10) && (
          <li>
            <Link
              className="paging-btn"
              to={"?page=1"}
              state={1}
              onClick={() => setStart(1)}
            >
              맨앞으로
            </Link>
          </li>
        )}
        {start > 10 ? (
          <li>
            <button className="paging-btn-10" onClick={prevClick}>
              <FaChevronLeft />
            </button>
          </li>
        ) : null}
        {Array(pageCount)
          .fill()
          .map(
            (
              a,
              i // 1~~~ 토탈 페이지 까지 0이하 막고
            ) =>
              start + i <= totalPages && start > 0 ? (
                <li key={start + i} className={start + i}>
                  <Link
                    className={
                      page == start + i ? "page-link-select" : "page-link"
                    }
                    to={`?page=${start + i}`}
                    state={start + i}
                  >
                    {start + i}
                  </Link>
                </li>
              ) : null
          )}
        {start == totalPages - 9 || start == totalPages - (num - 1) ? null : (
          <li>
            <button className="paging-btn-10" onClick={nextClick}>
              <FaChevronRight />
            </button>
          </li>
        )}
        {totalPages > 10 && (
          <li>
            <Link
              className="paging-btn"
              to={`?page=${totalPages}`}
              state={totalPages}
              onClick={lastPage}
            >
              맨뒤로
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Page;
