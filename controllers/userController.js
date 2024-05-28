import asyncHandler from "express-async-handler";
import User from "../models/employee.js";
import userRepository from "../repositories/userRepository.js";
import addUserRequest from "../requests/user/addUserRequest.js";
// const loginDetailsRepo = new LoginDetailsRepository();
const userRepo = new userRepository();

export default class UserController {
  /**
   * @swagger
   * /users/get:
   *   get:
   *     tags:
   *       - Users
   *     summary: Return logged in user details
   *     produces:
   *       - application/json
   *     security:
   *       - jwt: []
   *     responses:
   *       200:
   *         description: Success
   *       422:
   *         description: Unprocessable Entity
   *       401:
   *         description: Unauthenticated
   */

  async getUserProfile(req, res) {
    if (req.session.user) {
      res.json({
        status: true,
        message: "User profile details.",
        data: req.session.user,
      });
    } else {
      res.json({
        status: false,
        message: "User not found",
        data: [],
      });
    }
  }

  //
  /**
   * @swagger
   * /users/add:
   *   post:
   *     tags:
   *       - Users
   *     summary: Register New User
   *     produces:
   *       - application/json
   *     security:
   *       - jwt: []
   *     parameters:
   *        - in: query
   *          name: name
   *          description: User name
   *          type: string
   *        - in: query
   *          name: email
   *          description: User email address
   *          type: string
   *        - in: query
   *          name: password
   *          description: Your password
   *          type: string
   *        - in: query
   *          name: password_confirmation
   *          description: Confrim Your password
   *          type: string
   *     responses:
   *       200:
   *         description: Success
   *       422:
   *         description: Unprocessable Entity
   *       401:
   *         description: Unauthenticated
   */
  async registerUser(req, res) {
      try {
        const validatedData = await new addUserRequest(req).validate();
        validatedData['permissions']= ["product-create","product-view","product-delete","product-update"];
        const employeeDetails = await userRepo.addEmployee(validatedData);
        if (employeeDetails) {
          res.status(200).json({
            status: true,
            message: "Employee data added successfully.",
            data: [],
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Failed to add employee.",
            data: [],
          });
        }
      } catch (error) {
        console.log(error);
        res.status(422).json({
          status: false,
          message: "Failed to add employee.",
          errors: error,
        });
      }
    
  }
}
