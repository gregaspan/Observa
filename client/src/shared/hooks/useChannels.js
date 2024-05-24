import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  getFollowedChannels,
  getChannels as getChannelsRequest,
} from "../../api";

export const useChannels = () => {
  const [channels, setChannels] = useState(null);

  const getChannels = async (isLogged = false) => {
    const channelsData = await getChannelsRequest();

    if (channelsData.error) {
      return toast.error(
        channelsData.exception?.response?.data ||
          "Error occurred when fetching the channels"
      );
    }

    if (!isLogged) {
      return setChannels({
        channels: channelsData.data.channels,
      });
    }

    const followedChannelsData = await getFollowedChannels();

    if (followedChannelsData.error) {
      return toast.error(
        followedChannelsData.exception?.response?.data ||
          "Error occurred when fetching the followed channels"
      );
    }

    setChannels({
      channels: channelsData.data.channels,
      followedChannels: channelsData.data.channels.filter((channel) =>
        followedChannelsData.data.followedChannels.includes(channel.id)
      ),
    });
  };

};
