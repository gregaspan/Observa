import React from "react";
import { useUserDetails, useFollowChannel } from "../../../shared/hooks";

const FollowButton = ({ channelId, getChannels }) => {
  const { followChannel } = useFollowChannel();

  const handleFollowChannel = () => {
    followChannel(channelId, getChannels);
  };

  return (
    <button onClick={handleFollowChannel} className="channel-follow-button">
      Follow
    </button>
  );
};

export const ChannelDescription = ({
  username,
  title,
  description,
  channelId,
  getChannels,
}) => {
  const { isLogged } = useUserDetails();

  return (
    <div className="channel-description-container">
      <span className="channel-description-title">
        {username}
        <span>
          {isLogged && (
            <FollowButton
              className="channel-follow-button"
              channelId={channelId}
              getChannels={getChannels}
            />
          )}
        </span>
      </span>
      <span className="channel-description-subtitle">{title}</span>
      <div className="channel-description-box">
        <span className="channel-description">{description}</span>
      </div>
    </div>
  );
};
