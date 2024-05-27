import express from "express";
import {
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.route("/get").get(protect, getUserProfile);

export default router;
