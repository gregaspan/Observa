import User from "../../models/User.js";
import Channel from "../../models/Channel.js";

export const putChannelSettings = async (req, res) => {
  try {
    const { userId } = req.user;

    const { title, description, username, avatarUrl } = req.body;

    const userData = await User.findById(userId, { username: 1, channel: 1 });

    if (userData.username !== username) {
      await User.updateOne({ _id: userId }, { username });
    }

    console.log(userData);

    console.log(userData.channel);

    const channelData = await Channel.findByIdAndUpdate(
      userData.channel,
      {
        title,
        description,
        avatarUrl,
        isActive: true,
      },
      { new: true }
    );

    return res.status(200).json({
      channeId: channelData._id,
      username,
      title: channelData.title,
      description: channelData.description,
      avatarUrl: channelData.avatarUrl,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Something went wrong");
  }
};
