import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import { fileURLToPath } from "url";
import { dirname } from "path";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Optional: import protect if needed
import { protect } from "./middlewares/authMiddleware.js";

// const sessionRoutes = require("./routes/sessionRoutes");

import questionRoutes from "./routes/questionRoutes.js";

import { generateRecipes, generateExplanation } from "./controllers/aiController.js";
import { stripeWebHooks } from "./controllers/orderController.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//MIDDLEWARE TO HANDLE CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-type", "Authorization"],
    })
);

const allowedOrigins = ['http://localhost:5173'];

app.post("/stripe", express.raw({ type: "application/json" }), stripeWebHooks);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

connectDB();
connectCloudinary();

app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

// app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

//LATER, ADD app.use for AI 
app.use("/api/ai/generate-recipe", protect, generateRecipes);
app.use("/api/ai/generate-explanation", protect, generateExplanation);

//SERVE UPLOADS FOLDER
app.use("/uploads",
    express.static(path.join(__dirname, "uploads"), {
        setHeaders: (res, path) => {
            res.set("Access-Control-Allow-Origin", "http://localhost:5173");
        },
    })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on post ${PORT}`));

export default app;