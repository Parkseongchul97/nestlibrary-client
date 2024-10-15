import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";
import Register from "./pages/Register";
import LoginWait from "./pages/loginWait";

import Mypage from "./pages/Mypage";
import ChannelDetail from "./pages/ChannelDetail";
import PostDetail from "./pages/PostDetail";

import Example from "./components/Edit";

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
      {
        path: "channel/:channelCode",
        element: <ChannelDetail />,
        children: [
          {
            path: ":channelTagCode",
            element: <ChannelDetail />, 
          }
        ]
      },
    
      {
        path: "/post/:postCode",
        element: <PostDetail />,
      },
    ],
  },
  {
    path: "/kakao",
    element: <LoginWait />,
  },
  {
    path: "/write/:channelCode",
    element: <Example />,
  },
]);
export default router;
