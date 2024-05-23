import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./src/routes/authRoutes.js";
import channelsRoutes from "./src/routes/channelsRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";

dotenv.config();

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  return res.send("Tuki je server");
});

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelsRoutes);
app.use("/api/settings", settingsRoutes);

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server poslusa na portu ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Povezava z DB ni uspela. Server ni zagnan");
    console.log(err);
  });
