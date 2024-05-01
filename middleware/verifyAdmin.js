import jwt from "jsonwebtoken";
import UserModel from "../Model/UserModel.js"; // Import your user model
import { configDotenv } from "dotenv";

//env file config
configDotenv();

// Middleware to verify user token
const verifyAdmin = async (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1]; // Extract the token part from "Bearer token"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the Token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded.role);
    // Check if the user exists in the database based on username
    const user = await UserModel.findOne({
      username: decoded.Username,
      role: decoded.role,
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token. User not found." });
    }

    // Attach the user object to the request for further processing
    req.user = user;
    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ message: "Invalid token." });
  }
};

export default verifyAdmin;
