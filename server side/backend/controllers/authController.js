import User from "../models/user.js";
import jwt from "jsonwebtoken";
import validator from "../validators/user.validator.js";


//Generate jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//Register user
const registeringUser = async (req, res, next) => {
  try {
    const { body } = req;
    await validator.validateUserBody(...body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use!" });
    }

    const newUser = new User(body);
    const data = await newUser.save();
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

//Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error logging in user",
      error: error.message,
    });
  }
};

//Get user info
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

export { registeringUser, loginUser, getUserInfo };
