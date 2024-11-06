import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";
import Register from "./pages/Register";
import LoginWait from "./pages/loginWait";

import Mypage from "./pages/Mypage";
import ChannelDetail from "./pages/ChannelDetail";

import PostWrite from "./components/post/PostWrite";
import ChannelUpdate from "./pages/ChannelUpdate";
import Messages from "./pages/Messages";

import UserHelp from "./components/user/UserHelp";

import UserPage from "./pages/UserPage";
import Error from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/write",
        element: <PostWrite />,
      },
      {
        path: "/update/:channelCode",
        element: <ChannelUpdate />,
      },
      {
        path: "/user/:userEmail",
        element: <UserPage />,
      },

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
    path: "/error",
    element: <Error />,
  },
]);
export default router;
