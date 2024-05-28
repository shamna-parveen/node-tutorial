import asyncHandler from "express-async-handler";
import User from "../models/employee.js";
import userRepository from "../repositories/userRepository.js";
import addUserRequest from "../requests/user/addUserRequest.js"
// const loginDetailsRepo = new LoginDetailsRepository();
// const userRepo = new UserRepository();

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

async getUserProfile  (req, res)  {
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
};

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
async registerUser  (req, res)  {
//   const userRepo = new userRepository();
//   const { name, email, password } = req.query;
//   if (req.session.user.role == "Super Admin") {
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       res.json({
//         status: false,
//         message: "User with this email already exists",
//         data: [],
//       });
//     }

//     const user = await userRepo.addEmployee({ name, email, password });

//   console.log(user);
//     if (user) {
//       res.json({
//         status: true,
//         message: "User Created Successfully.",
//         data: user,
//       });
//     } else {
//       res.json({
//         status: false,
//         message: "Invalid user data.",
//         data: [],
//       });
//     }
//   } else {
//     res.json({
//       status: false,
//       message: "Super admin can only register the employee",
//       data: [],
//     });
//   }
// };

try {
  const validatedData = await new addUserRequest(req).validate()
  console.log(req);
  //Generate random password
  validatedData['password'] = await bcryptPassword(password)
  const employeeDetails = await employeeRepo.addEmployee(
      validatedData,
  )

  if (employeeDetails) {
      const employeeData = await EmployeeResponse.format(
          employeeDetails,
      )
      io.emit('employee-add', employeeData)

      /**
       * Send login credentials through email
       */
      await emailRepo.employeWelcome(
          validatedData.email,
          validatedData.email,
          password,
      )

      res.status(200).json({
          status: true,
          message: 'Employee data added successfully.',
          data: employeeData,
      })
  } else {
      res.status(422).json({
          status: false,
          message: 'Failed to add employee.',
          data: [],
      })
  }
} catch (error) {
  res.status(422).json({
      status: false,
      message: 'Failed to add employee.',
      errors: error,
  })
}
}
}