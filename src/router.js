import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";
import Register from "./pages/Register";
import LoginWait from "./pages/loginWait";

import Mypage from "./pages/Mypage";
import ChannelDetail from "./pages/ChannelDetail";

import PostWrite from "./components/PostWrite";
import ChannelUpdate from "./pages/ChannelUpdate";
import Messages from "./pages/Messages";
import MessageWrite from "./components/MessageWrite";

import UserHelp from "./pages/UserHelp";

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
        children: [
          {
            path: "to",
            element: <Messages />,
          },
          {
            path: "from",
            element: <Messages />,
          },
          {
            path: "all",
            element: <Messages />,
          },
        ],
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
            path: "post/:postCode",
            element: <ChannelDetail />,
          },
          {
            path: "best",
            element: <ChannelDetail />,
            children: [
              {
                index: true,
                element: <ChannelDetail />,
              },
              {
                path: "post/:postCode",
                element: <ChannelDetail />,
              },
            ],
          },

          {
            path: ":channelTagCode",
            children: [
              {
                index: true,
                element: <ChannelDetail />,
              },
              {
                path: "post/:postCode",
                element: <ChannelDetail />,
              },
              {
                path: "best",
                element: <ChannelDetail />,
                children: [
                  {
                    index: true,
                    element: <ChannelDetail />,
                  },
                  {
                    path: "post/:postCode",
                    element: <ChannelDetail />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "user/help",
        element: <UserHelp />,
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
