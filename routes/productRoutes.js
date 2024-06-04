import express from "express";
import productControllers from "../controllers/productControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadProductImages } from '../config/multer.js'; // Import the multer configuration

const product = new productControllers();

const router = express.Router();

router.route("/add").post(protect, uploadProductImages, product.addProduct.bind(product));

export default router;
