import Header from "./components/Header";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Maintest from "./components/Maintest";
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
]);
export default router;
