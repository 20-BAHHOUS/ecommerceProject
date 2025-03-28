import mongoose from "mongoose";

//connection à mongoose

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MmongoDB connection erreur:", err);
    process.exit(1);
  }
};

export default connectDB;
