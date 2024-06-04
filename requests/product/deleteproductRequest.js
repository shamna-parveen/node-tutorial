import Joi from "joi";
import ProductRepository from "../../repositories/product/productRepository.js";

const productRepo = new ProductRepository();

class DeleteProductRequest {
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
    this.data = req.query; // Changed from req.query to req.params
    this.req = req;
  }

  async validate() {
    const user = this.req.session.user;

    // Validate the ID
    const { error, value } = DeleteProductRequest.schema.validate(this.data, {
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

    // Check if the product exists
    const product = await productRepo.findById(this.data.id);
    if (!product) {
      throw { id: "Provided ID is incorrect" };
    }
    // Check if the authenticated user is the creator of the product
    if (product.creatable_id.toString() !== user.id.toString()) {
      throw {
        permissions: "You do not have permission to perform this action.",
      };
    }

    return value;
  }
}

export default DeleteProductRequest;
