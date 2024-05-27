import asyncHandler from "express-async-handler";
import User from "../models/employee.js";
import generateToken from "../utils/generateToken.js";
import LoginDetailsRepository from "../repositories/loginDetailsRepository.js";
import UserRepository from "../repositories/userRepository.js"; // Ensure the correct case for the class name
import {loginValidation} from "../requests/auth/loginRequest.js";

const loginDetailsRepo = new LoginDetailsRepository();
const userRepo = new UserRepository();

export default class AuthController {
  /**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login User
 *     operationId: login
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: query
 *          name: email
 *          description: "Your email"
 *          type: string
 *        - in: query
 *          name: password
 *          description: "Your password"
 *          type: string
 *     responses:
 *       200:
 *         description: Success
 *       422:
 *         description: Unprocessable Entity
 *       401:
 *         description: Unauthenticated
 */

  async login(req, res) {
    try {
      // Validate the request body
      await loginValidation(req, res);
  
      // Get the validated request body
      const validatedRequest = req.query;
  
      // Find the user by email
      const user = await User.findOne({ email: validatedRequest.email });
  
      if (user && (await user.matchPassword(validatedRequest.password))) {
        // Generate token for the user
        const token = generateToken(res, user._id);
  
        // Save login details using the repository method
        await loginDetailsRepo.addLoginDetails(user._id, user.email, true, token);
  
        // Respond with success message and user data
        res.json({
          status: true,
          message: "Logged In Successfully.",
          data: { user: user, token: token },
        });
      } else {
  
        // Respond with error message for invalid email or password
        res.status(401).json({
          status: false,
          message: "Invalid email or password.",
          data: [],
        });
      }
    } catch (error) {
      // Handle any errors
      console.error("Login error:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error.",
        data: [],
      });
    }
  }
  
  
}
