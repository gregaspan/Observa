import React from "react";

const imageUrl =
  "https://img.redbull.com/images/c_limit,w_1500,h_1000,f_auto,q_auto/redbullcom/2017/10/04/c0c3e2e4-c234-4844-8504-92e5be2f3e96/gothic-ii";

const ChannelAvatar = ({ url }) => {
  return (
    <div className="channels-avatar-container">
      <img src={url || imageUrl} width="100%" height="100%" />
    </div>
  );
};

export const ChannelCard = ({
  title,
  id,
  username,
  isOnline,
  avatarUrl,
  navigateToChannelHandler,
}) => {
  const handleNavigate = () => {
    navigateToChannelHandler(id);
  };

  return (
    <div className="channels-card" onClick={handleNavigate}>
      <ChannelAvatar url={avatarUrl} />
      <span className="channels-card-title">{title}</span>
      <span className="channels-card-text">{username}</span>
      <span
        className="channels-card-text"
        style={{ color: isOnline ? "green" : "red" }}
      >
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
};
