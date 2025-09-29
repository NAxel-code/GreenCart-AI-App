import express from "express";
import { upload } from "../config/multer.js";
import { protect } from "../middlewares/authMiddleware.js";
import { addProduct, changeStock, productById, productList } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array("images", 4), protect, addProduct);
productRouter.get("/list", productList);
productRouter.get("/id", productById);
productRouter.post("/stock", protect, changeStock);

export default productRouter;