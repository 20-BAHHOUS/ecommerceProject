import jwt from "jsonwebtoken";
import User from "../models/user.js";
  const protect = async (req, res, next) => { 
   let token = req.headers.authorization?.split(" ")[1];

   if (!token) {
    return res.status(401).json({ error: "Unauthorized, no token" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.User= await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({message: "Unauthorized, invalid token"});
    }
  }

};

export default protect;


