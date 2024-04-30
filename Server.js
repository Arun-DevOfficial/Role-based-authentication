import express from "express";
import dotenv from "dotenv";
import router from "./Router/router.js";
import mongoose from "mongoose";

// Express setup as app config
const server = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON bodies
server.use(express.json());

// Router config
server.use("/api/v1/", router);

// PORT Config
const PORT = process.env.PORT || 8080;

// DB Config
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Server listening...
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
