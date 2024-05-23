import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // create jwt token
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

      //poslji response userju
      return res.status(200).json({
        userDetails: {
          email: user.email,
          token,
          username: user.username,
        },
      });
    }

    return res.status(400).send("Neveljavni podatki. Poskusi ponovno.");
  } catch (err) {
    return res.status(500).send("Nekaj je slo narobe. Poskusi ponovno.");
  }
};
