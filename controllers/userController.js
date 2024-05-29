import asyncHandler from "express-async-handler";
import User from "../models/employee.js";
import userRepository from "../repositories/userRepository.js";
import addUserRequest from "../requests/user/addUserRequest.js";
import UpdateEmployeeRequest from "../requests/user/updateUserRequest.js";
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
      validatedData["permissions"] = [
        "product-create",
        "product-view",
        "product-delete",
        "product-update",
      ];
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
  /**
   * @swagger
   * /users/update:
   *   post:
   *     tags:
   *       - Users
   *     summary: Update user
   *     produces:
   *       - application/json
   *     security:
   *       - jwt: []
   *     parameters:
   *       - in: query
   *         name: id
   *         type: string
   *         description: Enter employee id
   *       - in: query
   *         name: name
   *         type: string
   *         description: User name
   *       - in: query
   *         name: email
   *         type: string
   *         description: User email address
   *       - in: query
   *         name: password
   *         type: string
   *         description: Your password
   *       - in: query
   *         name: password_confirmation
   *         type: string
   *         description: Confirm your password
   *     responses:
   *       200:
   *         description: Success
   *       422:
   *         description: Unprocessable Entity
   *       401:
   *         description: Unauthenticated
   */

  async updateUser(req, res) {
    try {
      const validatedData = await new UpdateEmployeeRequest(req).validate();

      const employeeData = await userRepo.findById(validatedData.id);

      const updatedEmployee = await userRepo.updateEmployee(validatedData);
      if (updatedEmployee) {
        res.status(200).json({
          status: true,
          message: "Employee data updated successfully.",
          data: employeeData,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Unable to update employee.",
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
      res.status(422).json({
        status: false,
        message: "Unable to update employee.",
        errors: error,
      });
    }
  }
}
