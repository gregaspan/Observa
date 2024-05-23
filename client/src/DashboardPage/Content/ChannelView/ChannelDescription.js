import React from "react";

export const ChannelDescription = ({ username, title, description }) => {
  return (
    <div className="channel-description-container">
      <span className="channel-description-title">{username}</span>
      <span className="channel-description-subtitle">{title}</span>
      <div className="channel-description-box">
        <span className="channel-description">{description}</span>
      </div>
    </div>
  );
};
