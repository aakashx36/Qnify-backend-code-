const jwt = require("jsonwebtoken");
const userSchema = require("../model/userModel.js");

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  try {
    // Check if token exists in headers and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from "Bearer TOKEN"
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from DB and attach to req object
      // This creates req.user for the next function
      req.user = await userSchema.findById(decoded.id).select("-password");

      next(); // Move to the next middleware/controller
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};

const protector = async (req, res, next) => {
  let token;

  // 1. Read token from cookie
  if (req.cookies.token) {
    try {
      token = req.cookies.token;

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.Jwt_Secret);

      // 3. Get user from DB (excluding password) and attach to request
      req.user = await userSchema.findById(decoded.id).select("-password");

      if (!req.user) {
        // Handle case where user ID in token doesn't exist anymore
        throw new Error("User not found");
      }

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error("Token verification failed:", error);
      // Clear invalid cookie if verification fails
      res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token found in cookies
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protector };
