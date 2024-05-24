import axios from "axios";
import User from "../../models/User.js";

export const getChannels = async (_, res) => {
  try {
    const users = await User.find(
      {},
      {
        channel: 1,
        username: 1,
      }
    ).populate("channel");

    const requestData = await axios.get("http://localhost:8000/api/streams");

    const activeStreams = requestData.data;

    let liveStreams = [];

    for (const streamId in activeStreams?.live) {
      if (
        activeStreams.live[streamId].publisher &&
        activeStreams.live[streamId].publisher !== null
      ) {
        liveStreams.push(streamId);
      }
    }

    const channels = users
      .filter((u) => u.channel.isActive)
      .map((user) => {
        return {
          id: user.channel._id,
          title: user.channel.title,
          avatarUrl: user.channel.avatarUrl,
          username: user.username,
          isOnline: liveStreams.includes(user.channel.streamKey),
        };
      });

    return res.json({
      channels,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).message("Something went wrong");
  }
};
