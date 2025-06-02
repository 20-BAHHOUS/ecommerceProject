import jwt from "jsonwebtoken";
import User from "../models/user.js";

/**
 * Optional authentication middleware
 * If token is provided and valid, sets req.user
 * If not, continues without authentication
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    // If no token, just continue without setting req.user
    if (!token) {
      return next();
    }
    
    // Try to verify token and set req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    // If user found, set it on the request object
    if (user) {
      req.user = user;
    }
    
    // Continue regardless of whether token verification succeeded
    next();
  } catch (error) {
    // If token verification fails, just continue without setting req.user
    console.log("Optional auth: Invalid token, continuing as guest");
    next();
  }
};

export default optionalAuth; 