import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getChannelSettings, updateChannelSettings } from "../../api";

export const useChannelSettings = () => {
  const [channelSettings, setChannelSettings] = useState(null);

  const fetchChannelSettings = async () => {
    const response = await getChannelSettings();

    if (response.error) {
      return toast.error(
        response.exception?.response?.data ||
          "Error occurred when fetching channel settings"
      );
    }

    setChannelSettings({
      username: response.data.username,
      title: response.data.title,
      description: response.data.description,
      avatarUrl: response.data.avatarUrl,
      streamKey: response.data.streamKey,
    });
  };

  const saveSettings = async (data) => {
    const response = await updateChannelSettings(data);

    if (response.error) {
      return toast.error(
        response.exception?.response?.data ||
          "Error occurred when saving channel details"
      );
    }

    toast.success("Channel settings saved successfully");
  };

  useEffect(() => {
    fetchChannelSettings();
  }, []);

  return {
    isFetching: !channelSettings,
    channelSettings,
    saveSettings,
  };
};
