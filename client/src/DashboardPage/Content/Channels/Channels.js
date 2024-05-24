import React from "react";
import { useNavigate } from "react-router-dom";
import { ChannelCard } from "./ChannelCard";

export const dummyChannels = [
  {
    id: 1,
    title: "test",
    avatarUrl: null,
    username: "Martin",
    isOnline: false,
  },
  {
    id: 2,
    title: "test1",
    avatarUrl: null,
    username: "Marta",
    isOnline: true,
  },
  {
    id: 3,
    title: "test2",
    avatarUrl: null,
    username: "Jack",
    isOnline: false,
  },
  {
    id: 4,
    title: "test3",
    avatarUrl: null,
    username: "Anna",
    isOnline: false,
  },
];

export const Channels = ({ channels }) => {
  const navigate = useNavigate();

  const handleNavigateToChannel = (id) => {
    navigate(`/channel/${id}`);
  };

  return (
    <div className="channels-container">
      {channels.map((c) => (
        <ChannelCard
          key={c.id}
          id={c.id}
          title={c.title}
          username={c.username}
          isOnline={c.isOnline}
          avatarUrl={c.avatarUrl}
          navigateToChannelHandler={handleNavigateToChannel}
        />
      ))}
    </div>
  );
};
