import Joi from "joi";
import UserRepository from "../../repositories/userRepository.js";
import checkPermissions from "../../utils/checkPermission.js";

const userRepo = new UserRepository();

class getUserRequest {
  /**
   * Add validation rules for the request
   */
  static schema = Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "ID must be a valid 24-character hex string",
        "any.required": "ID is required",
      }),
  });

  constructor(req) {
    this.data = req.query;
    this.req = req;
  }

  async validate() {
    const user = this.req.session.user;
    // First, check if the requested ID matches the authenticated user's ID
    if (this.data.id !== user.id.toString()) {
      // If IDs don't match, check permissions
      const hasPermission = await checkPermissions(user, "employee-view");
      if (!hasPermission) {
        throw { permissions: "You do not have permission to perform this action." };
      }
    }

    // Validate the ID
    const { error, value } = getUserRequest.schema.validate(this.data, {
      abortEarly: false,
    });

    // If validation fails, throw errors
    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        validationErrors[err.context.key] = err.message;
      });
      throw validationErrors;
    }

    // Check if the ID exists in the user repository
    const idExists = await userRepo.findById(this.data.id);
    if (!idExists) {
      throw { id: "Provided ID is incorrect" };
    }

    return value;
  }
}

export default getUserRequest;
