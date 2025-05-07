import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import pathObject from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import annonceRoutes from "./routes/annonceRoutes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = pathObject.dirname(__filename);
const annonceImagesDirectory = pathObject.join(__dirname, "./uploads/annonces");
const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

//connecter a mongoose
connectDB();

app.use("/auth", authRoutes);
app.use("/annonce", annonceRoutes);
app.use("/annonce-images", express.static(annonceImagesDirectory));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
