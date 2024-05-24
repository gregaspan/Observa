import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getChannelSettings, updateChannelSettings } from "../../api";


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
