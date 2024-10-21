import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";
import Register from "./pages/Register";
import LoginWait from "./pages/loginWait";

import Mypage from "./pages/Mypage";
import ChannelDetail from "./pages/ChannelDetail";
import PostDetail from "./pages/PostDetail";

import PostWrite from "./components/PostWrite";
import ChannelUpdate from "./pages/ChannelUpdate";
import Messages from "./pages/Messages";
import MessageWrite from "./components/MessageWrite";

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
        path: "/messages",
        element: <Messages />,
      },
      {
        path: "/message/write",
        element: <MessageWrite />,
      },
      {
        path: "channel/:channelCode",
        element: <ChannelDetail />,
        children: [
          {
            path: ":channelTagCode",
            element: <ChannelDetail />,
          },
        ],
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
    path: "/write",
    element: <PostWrite />,
  },
  {
    path: "/update/:channelCode",
    element: <ChannelUpdate />,
  },
]);
export default router;
