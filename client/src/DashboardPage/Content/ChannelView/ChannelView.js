import React from "react";
import { Chat } from "./Chat";
import { ChannelDescription } from "./ChannelDescription";

const channelDetails = {
  id: 1,
  title: "Gaming channel",
  description: "Playing some RPG",
  username: "Gamer",
  isOnline: false,
};

export const ChannelView = () => {
  return (
    <div className="channel-container">
      <div className="channel-video-description-section">
        <div className="channel-offline-placeholder">
          <span>Channel is offline</span>
        </div>
        <ChannelDescription
          channelId={channelDetails.id}
          title={channelDetails.title}
          description={channelDetails.description}
          username={channelDetails.username}
        />
      </div>
      <Chat />
    </div>
  );
};
