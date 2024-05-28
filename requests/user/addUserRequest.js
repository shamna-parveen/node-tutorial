import Joi from "joi";
import userRepository from "../../repositories/userRepository.js";
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
  });

  constructor(req) {
    this.data = {
      name: req.query.name,
      email: req.query.email,
      password: req.query.password,
    };
  }

  async validate() { 
    const { error, value } = AddEmployeeRequest.schema.validate(this.data, {
      abortEarly: false,
    });
    /**
     * Check email exist or not
     */
    const checkEmailExists =
      await AddEmployeeRequest.employeeRepo.getEmployeeByEmail(this.data.email);

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
  }
}

export default AddEmployeeRequest;
