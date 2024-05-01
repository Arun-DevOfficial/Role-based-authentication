import UserModel from "../Model/UserModel.js";
import bcrypt from "bcrypt";

// to make valid user
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
      role: role,
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
      role: role,
    });

    // Save the new user to the database
    await newUser.save();

    // Construct payload
    const User = {
      Username: username,
      Password: password,
      role: role,
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

//To verify user
export const signIn = async (req, res) => {
  const { username, password, role } = req.body;
  // Error Handling
  try {
    // Check if both username, password, and role are provided
    if (!username || !password || !role) {
      return res
        .status(400)
        .json({ message: "Username, password, and role are required!" });
    }

    // Check if the user with the same username and role exists
    const existingUser = await UserModel.findOne({
      username: username,
      role: role,
    });

    if (!existingUser) {
      // User doesn't exist
      return res.status(401).json({ message: "User not found." });
    }
    console.log(password);
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (passwordMatch) {
      return res.status(200).json({ message: "User logged in successfully." });
    } else {
      // Password doesn't match
      return res
        .status(401)
        .json({ message: "Incorrect username or password." });
    }
  } catch (error) {
    // Internal server error
    console.error("Error in sign in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//To list all user
export const getUser = async (req, res) => {
  try {
    const user = await UserModel.find();
    if (user) return res.json(user);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};