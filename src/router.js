import Header from "./components/Header";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
  },
]);
export default router;
