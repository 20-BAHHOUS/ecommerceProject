import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
//import { fileURLToPath } from "url";


import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import annonceRoutes from "./routes/annonceRoutes.js";
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
app.use("/home",homeRoutes);
app.use("/annonce", annonceRoutes);

//serve uploads folder
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
