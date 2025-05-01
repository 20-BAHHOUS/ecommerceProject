// server side/backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import fs from "fs";
import multer from 'multer'; // <--- IMPORT MULTER HERE

import authRoutes from "./routes/authRoutes.js";
import annonceRoutes from "./routes/annonceRoutes.js";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware for JSON bodies
app.use(express.json());
// Middleware for URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Connect to mongoose
connectDB();

// --- Serve uploaded files statically ---
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));
console.log(`Serving static files from: ${uploadDir}`);

// API Routes
app.use("/auth", authRoutes);
app.use("/annonce", annonceRoutes);

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.message, err.stack); // Log message and stack
    const statusCode = err.status || 500;

    // Check specifically for MulterError using the imported multer
    if (err instanceof multer.MulterError) { // <--- Now multer is defined
        return res
            .status(400) // Bad Request for upload errors
            .json({ message: `File Upload Error: ${err.message}` });
    }

    // Handle Joi validation errors (check for status added in validator)
    if (err.status === 400) {
         return res.status(400).json({ message: err.message || 'Validation Failed' });
    }

    // Handle other errors
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        // Optionally include stack trace in development
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
