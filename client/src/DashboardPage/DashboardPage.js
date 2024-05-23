import React from "react";
import { Nav } from "./Nav";
import { Sidebar } from "./Sidebar";
import { Content } from "./Content";

import "./dashboardPage.css";

export const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <Nav />
      <Sidebar />
      <Content />
    </div>
  );
};
