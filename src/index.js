import React from "react";
import ReactDOM from "react-dom/client";
import router from "./router";
import { RouterProvider } from "react-router-dom";
import "./assets/reset.css";
import store from "./store";
import { Provider } from "react-redux";
import { AuthPorvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthPorvider>
      <RouterProvider router={router} />
    </AuthPorvider>
  </Provider>
);
