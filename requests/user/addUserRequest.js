import Joi from "joi";
import userRepository from "../../repositories/userRepository.js";
import checkPermissions from "../../utils/checkPermission.js";
class AddEmployeeRequest {
  static employeeRepo = new userRepository();

  /**
   * Add validation rules for the request
   */
  static schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Please enter the full name of the employee.",
      "any.required": "Please enter the full name of the employee.",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Please enter a valid email address.",
      "any.required": "Please enter a valid email address.",
      "string.email": "Please enter a valid email address.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required.",
      "any.required": "Password is required.",
    }),
    role_id: Joi.string().optional(), // Add permissions field
  });

  constructor(req) {
    this.req = req;
    this.data = {
      name: req.query.name,
      email: req.query.email,
      password: req.query.password,
      role_id: req.query.role_id,
    };
  }

  async validate() {
    if (checkPermissions("employee-create")) {
      console.log("innaaaa");
      // Validate input data
      const { error, value } = AddEmployeeRequest.schema.validate(this.data, {
        abortEarly: false,
      });
      // Check if email already exists
      const checkEmailExists =
        await AddEmployeeRequest.employeeRepo.getEmployeeByEmail(
          this.data.email
        );

      if (error || checkEmailExists) {
        const validationErrors = {};
        error
          ? error.details.forEach((err) => {
              validationErrors[err.context.key] = err.message;
            })
          : [];

        if (checkEmailExists !== null) {
          validationErrors["email"] =
            "Email id is already taken. Try another one.";
        }

        throw validationErrors;
      }

      return value;
    } else {
      throw { permissions: "You do not have permission to add an employee." };
    }
  }
}

export default AddEmployeeRequest;
