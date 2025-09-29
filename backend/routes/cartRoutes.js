import express from "express"
import { protect } from "../middlewares/authMiddleware.js"
import { updateCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/update", protect, updateCart);

export default cartRouter;