import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { placeOrderCOD, getUserOrders, getAllOrders, placeOrderStripe } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/cod", protect, placeOrderCOD);
orderRouter.post("/stripe", protect, placeOrderStripe);
orderRouter.get("/user", protect, getUserOrders);
orderRouter.get("/seller", protect, getAllOrders);

export default orderRouter;