import User from "../../models/User.js";

export const postRegister = async (req, res) => {
  const user = await User.create({
    username: "Janez",
    email: "novak@mail.com",
    password: "password",
  });

  return res.send("uporabnik je bil dodan v bazo");
};
