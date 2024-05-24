import { useState } from "react";
import { toast } from "react-hot-toast";
import { getChannelDetails as getChannelDetailsRequest } from "../../api";

export const useChannelDetails = () => {
  const [channelDetails, setChannelDetails] = useState(null);


    setChannelDetails(responseData.data);
  };

  return {
    channelDetails,
    isFetching: !channelDetails,
    getChannelDetails,
  };
