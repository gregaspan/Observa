import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./AuthPage";
import { DashboardPage } from "./DashboardPage";
import { App } from "./App";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/*" element={<DashboardPage />} />
      </Routes>
    </App>
  </BrowserRouter>
);
