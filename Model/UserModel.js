import mongoose from "mongoose";

// Define the user schema
const userModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    required: true,
  },
});

// Create the user model
const UserModel = mongoose.model("user", userModel);

export default UserModel;
