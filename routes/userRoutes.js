import express from "express";
import 
UserController
   from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();
const user = new UserController()

router.route('/get').get(protect, user.getUserProfile)
router.route("/add").post(protect,user.registerUser);
router.route("/update").post(protect,user.updateUser);
router.route("/get_user").post(protect,user.getUser);
router.route("/list").post(protect,user.listAllEmployee);


export default router;
