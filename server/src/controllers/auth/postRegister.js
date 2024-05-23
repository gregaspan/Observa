import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.exists({ email });

    if (userExists) {
      return res.status(409).send("E-mail je ze v uporabi!");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // create JWT token
    const token = jwt.sign(
      //podatki o uporabniku ki jih zelimo enkriptat z JWT token
      {
        userId: user._id,
        email: user.email,
      },
      //secret
      process.env.TOKEN_KEY,
      
      {
        expiresIn: "8h",
      }
    );

    //posljir esponse uporabniku  z podatki o registraciji and JWT
    return res.status(201).json({
      userDetails: {
        email: user.email,
        username,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error. Poizkusi znova.");
  }
};
