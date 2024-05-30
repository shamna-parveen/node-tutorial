import Joi from "joi";
import userRepository from "../../repositories/userRepository.js";
import checkPermissions from "../../utils/checkPermission.js";

class UpdateEmployeeRequest {
  static employeeRepo = new userRepository();

  /**
   * Add validation rules for the request
   */
  static schema = Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    name: Joi.string().required().messages({
      "string.empty": "Please enter the full name of the employee.",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Please enter a valid email address.",
      "any.required": "Please enter a valid email address.",
      "string.email": "Please enter a valid email address.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required.",
    }),
    role_id: Joi.string().optional(), // Add permissions field
  });

  constructor(req) {
    this.req = req;
    this.data = {
      id: req.query.id,
      name: req.query.name,
      email: req.query.email,
      password: req.query.password,
      role_id: req.query.role_id,
    };
  }

  async validate() {
    const user = this.req.session.user;
    const hasPermission = await checkPermissions(user, "employee-update");

    // Check for necessary permissions in session
    if (!hasPermission) {
      throw {
        permissions: "You do not have permission to update an employee.",
      };
    } else {
      // Validate input data
      const { error, value } = UpdateEmployeeRequest.schema.validate(
        this.data,
        {
          abortEarly: false,
        }
      );

      /**
       * check employeeId exist or not
       */
      const checkEmployeeIdExists =
        await UpdateEmployeeRequest.employeeRepo.findById(this.data.id);

      if (error || !checkEmployeeIdExists) {
        const validationErrors = {};
        if (error) {
          error.details.forEach((err) => {
            validationErrors[err.context.key] = err.message;
          });
        }

        if (!checkEmployeeIdExists) {
          validationErrors["id"] = "Employee with this ID does not exist.";
        }

        throw validationErrors;
      }

      return value;
    }
  }
}

export default UpdateEmployeeRequest;
