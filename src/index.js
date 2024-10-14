import React from "react";
import ReactDOM from "react-dom/client";
import router from "./router";
import { RouterProvider } from "react-router-dom";
import "./assets/reset.css";
import store from "./store";
import { Provider } from "react-redux";
import { AuthPorvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <AuthPorvider>
        <RouterProvider router={router} />
      </AuthPorvider>
    </Provider>
  </QueryClientProvider>
);
