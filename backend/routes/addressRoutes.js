import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { addAddress, getAddress } from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post("/add", protect, addAddress);
addressRouter.get("/get-address", protect, getAddress);

export default addressRouter;