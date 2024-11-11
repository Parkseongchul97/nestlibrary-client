import { useEffect, useState } from "react";
import "../assets/page.scss";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Page = ({ page, totalPages, pageBtnOnClick, isComment, commentPage }) => {
  // 페이지 현제 페이지 토탈은 총 몇페이지인지
  const pageCount = 10; // 화면에 보이는 페이지 숫자
  let num = totalPages % 10;
  const [start, setStart] = useState(1); // 시작점
  const prevClick = () => {
    // 10단위 이전페이지
    if (start > 10) {
      // 11페이지 스타팅 이상이면
      setStart(start - 10);
    }
  };

  const nextClick = () => {
    // 남은페이지가 있으면 현재 +10
    if (start + pageCount <= totalPages) {
      setStart(start + pageCount); // 11페이지로 스타팅을 바꿈
    }
  };
  const lastPage = () => {
    // 맨마지막 좌표 페이지로
    if (num === 0) {
      // 값이 딱떨어지는 페이지 숫자라면
      setStart(totalPages - 9); // 바로 마지막 페이지로
    } else {
      setStart(totalPages - (num - 1));
    }
  };
  useEffect(() => {
    // 댓글 제외 페이징이면
    if (!isComment) {
      const newStart = Math.floor((page - 1) / pageCount) * pageCount + 1;
      setStart(newStart);
    }
  }, [page]);

  useEffect(() => {
    // 댓글 페이징이면
    if (isComment) {
      const newStart =
        Math.floor((commentPage - 1) / pageCount) * pageCount + 1;
      setStart(newStart);
    }
  }, [commentPage]);

  return (
    <div className="paging">
      <ul className="paging-number">
        {(totalPages > 10 || start > 10) && (
          <li>
            <Link
              className="paging-btn"
              to={isComment ? `?&page=${page}&comment_page=1` : "?page=1"}
              state={1}
              onClick={() => {
                setStart(1);

                if (pageBtnOnClick !== undefined) {
                  pageBtnOnClick();
                }
              }}
            >
              <FaChevronLeft />
              <FaChevronLeft />
            </Link>
          </li>
        )}
        {start > 10 ? (
          <li>
            <button
              className="paging-btn-10"
              onClick={() => {
                prevClick();

                if (pageBtnOnClick !== undefined) {
                  pageBtnOnClick();
                }
              }}
            >
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
                      isComment && Number(commentPage) == start + i
                        ? "page-link-select"
                        : isComment
                        ? "page-link"
                        : Number(page) === start + i
                        ? "page-link-select"
                        : "page-link"
                    }
                    to={
                      isComment
                        ? `?page=${page}&comment_page=${start + i}`
                        : `?page=${start + i}`
                    }
                    state={start + i}
                    onClick={() => {
                      if (pageBtnOnClick !== undefined) {
                        pageBtnOnClick();
                      }
                    }}
                  >
                    {start + i}
                  </Link>
                </li>
              ) : null
          )}
        {start === totalPages - 9 || start === totalPages - (num - 1) ? null : (
          <li>
            <button
              className="paging-btn-10"
              onClick={() => {
                nextClick();

                if (pageBtnOnClick !== undefined) {
                  pageBtnOnClick();
                }
              }}
            >
              <FaChevronRight />
            </button>
          </li>
        )}
        {totalPages > 10 && (
          <li>
            <Link
              className="paging-btn"
              to={
                isComment
                  ? `?page=${page}&comment_page=${totalPages}`
                  : `?page=${totalPages}`
              }
              state={totalPages}
              onClick={() => {
                lastPage();

                if (pageBtnOnClick !== undefined) {
                  pageBtnOnClick();
                }
              }}
            >
              <FaChevronRight />
              <FaChevronRight />
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Page;
