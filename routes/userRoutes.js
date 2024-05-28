import express from "express";
import 
UserController
   from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();
const user = new UserController()

router.route('/get').get(protect, user.getUserProfile)
router.route("/add").post(protect,user.registerUser);


export default router;
