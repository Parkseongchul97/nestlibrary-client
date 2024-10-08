import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";
import Register from "./pages/Register";
import LoginWait from "./pages/loginWait";
import KakaLoginSuccess from "./components/KakaoLoginSuccess";
import Mypage from "./pages/Mypage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/mypage",
        element: <Mypage />,
      },
    ],
  },
  {
    path: "/kakao",
    element: <LoginWait />,
  },
  {
    path: "/login-success",
    element: <KakaLoginSuccess />,
  },
]);
export default router;
