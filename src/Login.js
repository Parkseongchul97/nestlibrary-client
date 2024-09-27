import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";

const FormStyle = styled.div`
  .login-box {
    font-family: "Pretendard Variable";
    font-style: normal;
    font-weight: 600;
    background-color: #ffffff;
    width: 400px;
    height: 326px;
    position: fixed;
    top: 25%;
    left: 40%;
    border-radius: 8px;
    padding: 20px;
    color: #7e8e9f;
    opacity: 1;
    z-index: 20;
    .login-body {
      button {
        align-items: center;
        height: 2.5rem;
        width: 90%;
        border-radius: 6px;
        border: 1px solid #f7f8f9;
        background-color: #f7f8f9;
        margin-bottom: 1rem;
      }
    }

    .login-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1.5rem;
      width: 63%;
      .close {
        width: 2rem;
        height: 2rem;
        border-radius: 6px;
        border: 1px solid #f7f8f9;
        background-color: #f7f8f9;
      }
      h3 {
        color: black;
      }
    }
    .login-form {
      display: flex;
      flex-direction: column;
      width: 100%;
      justify-content: center;
      align-items: center;
      input {
        font-family: "Pretendard Variable";
        font-style: normal;
        font-weight: 600;
        border-radius: 6px;
        border: 1px solid #f7f8f9;
        width: 90%;
        height: 40px;
        padding-left: 16px;
        margin-bottom: 0.75rem;
        background-color: #f7f8f9;
        &:focus {
          outline: none;
        }
      }
      .findId {
        margin-bottom: 1rem;
      }
    }
    .message {
      text-align: center;
      span {
        margin-right: 0.5rem;
      }
      a {
        color: red;
      }
    }
  }
  .login-bg {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const Login = ({ onClose }) => {
  return (
    <FormStyle>
      <div className="login-box">
        <div className="login-header">
          <button className="close">
            <IoIosArrowBack />
          </button>
          <h3>로그인</h3>
        </div>
        <div className="login-body">
          <form className="login-form">
            <input placeholder="아이디" />
            <input placeholder="비밀번호" />

            <div className="findId">
              <a href="">ID/PW 찾기</a>
            </div>
            <button type="submit">로그인</button>
          </form>
          <div className="message">
            <span>아직 회원이 아니신가요?</span>
            <a href="">회원가입 하기</a>
          </div>
        </div>
      </div>
      <div className="login-bg" onClick={onClose}></div>
    </FormStyle>
  );
};

export default Login;
