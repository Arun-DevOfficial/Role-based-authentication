import Token from "jsonwebtoken";
import UserModel from "../Model/UserModel.js";
import bcrypt from "bcrypt";


export const signUp = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if both username, password, and role are provided
    if (!username || !password || !role) {
      return res
        .status(400)
        .json({ message: "Username, password, and role are required!" });
    }

    // Check if the user already exists with the same username and role
    const existingUser = await UserModel.findOne({
      username: username,
      Role: role,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Please try logging in instead.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the provided role
    const newUser = new UserModel({
      username: username,
      password: hashedPassword,
      Role: role,
    });

    // Save the new user to the database
    await newUser.save();

    // Construct payload
    const User = {
      Username: username,
      Password: password,
      Role: role,
    };

    let token;

    if (role === "admin") {
      // To create token for registered user
      token = await Token.sign(User, process.env.ACCESS_TOKEN_SECRET);
    }

    // Registration successful
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
};

//to verify signUp
export const signIn = async (req, res) => {
  const { username, password, role } = req.user;

  //Error Handling
  try {
    // Check if both username, password, and role are provided
    if (!username || !password || !role) {
      return res
        .status(400)
        .json({ message: "Username, password, and role are required!" });
    }

    // Check if the user with the same username and role
    const existingUser = await UserModel.findOne({
      username: username,
      Role: role,
    });

    // Verify the user exisiting or not
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Please try logging in instead.",
      });
    }
    //To verify the paasword
    const originalPassword = bcrypt.compare(password, existingUser.password);

    // Check whether password is correct or not
    if (originalPassword)
      return res.status(201).json({ message: "User Logged successfully..." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
