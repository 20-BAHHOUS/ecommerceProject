import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import pathObject from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import annonceRoutes from "./routes/annonceRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
import notificationRoutes from "./routes/notificationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathObject.dirname(__filename);
const annonceImagesDirectory = pathObject.join(__dirname, "./uploads/annonces");
const profileImagesDirectory = pathObject.join(__dirname, "./uploads/profile");

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON bodies
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/annonce", annonceRoutes);
app.use("/orders", orderRoutes);
app.use("/notifications", notificationRoutes);

// Serve uploaded images
app.use("/uploads/annonces", express.static(annonceImagesDirectory));
app.use("/uploads/profile", express.static(profileImagesDirectory));

// Connect to database
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
