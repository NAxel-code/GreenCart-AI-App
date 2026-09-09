import express from "express";
import { addQuestionToSession } from "../controllers/questionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addQuestionToSession);

export default router;