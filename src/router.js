import Header from "./components/Header";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Maintest from "./components/Maintest";
import LoginWait from "./pages/loginWait";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Maintest />,
      },
    ],
  },
  {
    path: "/kakao",
    element: <LoginWait />,
  },
]);
export default router;
