import React, { useEffect } from "react";
import { Nav } from "./Nav";
import { Sidebar } from "./Sidebar";
import { Content } from "./Content";
import { useChannels, useUserDetails } from "../shared/hooks";
import { LoadingSpinner } from "../shared/components";

import "./dashboardPage.css";

export const DashboardPage = () => {
  const { getChannels, isFetching, followedChannels, allChannels } =
    useChannels();
  const { isLogged } = useUserDetails();

  useEffect(() => {
    getChannels(isLogged);
  }, []);

  if (isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard-container">
      <Nav />
      <Sidebar channels={followedChannels} />
      <Content channels={allChannels} getChannels={getChannels} />
    </div>
  );
};
