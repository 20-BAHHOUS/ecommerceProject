import User from "../models/user.js";
import jwt from "jsonwebtoken";
import validateUserBody from "../validators/user.validator.js";


//Generate jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//Register user
const registeringUser = async (req, res, next) => {
  try {
    const { body } = req;
    await validateUserBody(body);
    
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
    // Find user by email
    const user = await User.findOne({ email });
    
    // If user doesn't exist, return error
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    
    // If password doesn't match, return error
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // If everything is valid, generate token and return user data
    res.status(200).json({
      _id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
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
}
  // Update user profile information
const updateUserProfile = async (req, res) => {
  try {
    const { fullName, email, phone, profileImageUrl, location } = req.body;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, email, phone, profileImageUrl, location },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// Update user password with old password confirmation
const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Old password and new password are required" });
    }

    // Check if new password meets minimum requirements
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters long" });
    }

    const user = await User.findById(userId).select("+password"); // Select password to compare
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    // Set the new password and save (this will trigger the pre-save middleware that hashes the password)
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};

// Get user's favorite announcements
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user and populate the favorites field with annonce details
    const user = await User.findById(userId)
      .select('favorites')
      .populate({
        path: 'favorites',
        model: 'Annonce',
        select: 'title description price images category subcategory type condition createdAt'
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Error fetching favorites", error: error.message });
  }
};

// Add or remove an announcement from favorites
const toggleFavorite = async (req, res) => {
  try {
    const { annonceId } = req.body;
    const userId = req.user.id;

    if (!annonceId) {
      return res.status(400).json({ error: "Announcement ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the announcement is already in favorites
    const isFavorite = user.favorites.some(id => id.toString() === annonceId);

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(id => id.toString() !== annonceId);
      await user.save();
      return res.status(200).json({ message: "Removed from favorites", isFavorite: false });
    } else {
      // Add to favorites
      user.favorites.push(annonceId);
      await user.save();
      return res.status(200).json({ message: "Added to favorites", isFavorite: true });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Error updating favorites", error: error.message });
  }
};

// Check if an announcement is in user's favorites
const checkFavorite = async (req, res) => {
  try {
    const { annonceId } = req.params;
    const userId = req.user.id;

    if (!annonceId) {
      return res.status(400).json({ error: "Announcement ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the announcement is in favorites
    const isFavorite = user.favorites.some(id => id.toString() === annonceId);
    
    return res.status(200).json({ isFavorite });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    res.status(500).json({ message: "Error checking favorite status", error: error.message });
  }
};



export { 
  registeringUser, 
  loginUser, 
  getUserInfo, 
  updateUserPassword, 
  updateUserProfile, 
  getUserFavorites,
  toggleFavorite,
  checkFavorite,
 
};
