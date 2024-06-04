import Joi from 'joi';
import ProductRepository from '../../repositories/product/productRepository.js';
import checkPermissions from "../../utils/checkPermission.js";

class AddProductRequest {
  static productRepo = new ProductRepository();

  /**
   * Validation rules for the request
   */
  static schema = Joi.object({
    product_name: Joi.string().required().messages({
      'string.empty': 'Please enter the product name.',
      'any.required': 'Please enter the product name.',
    }),
    images: Joi.array().items(Joi.object()).min(1).required().messages({
      'array.min': 'Please upload at least one image.',
      'any.required': 'Please upload at least one image.',
    }),
  });

  constructor(req) {
    this.req = req;
    this.data = {
      product_name: req.body.product_name,
      images: req.files,
    };
  }

  async validate() {
    const user = this.req.session.user;
    const hasPermission = await checkPermissions(user, 'product-create');
    if (hasPermission) {
      // Validate input data
      const { error, value } = AddProductRequest.schema.validate(this.data, {
        abortEarly: false,
      });
      
      // Check if product name already exists
      const checkProductNameExists = await AddProductRequest.productRepo.getProductByName(this.data.product_name);

      if (error || checkProductNameExists) {
        const validationErrors = {};
        if (error) {
          error.details.forEach((err) => {
            validationErrors[err.context.key] = err.message;
          });
        }

        if (checkProductNameExists !== null) {
          validationErrors['product_name'] = 'Product name is already taken. Try another one.';
        }

        throw validationErrors;
      }

      return value;
    } else {
      throw { permissions: 'You do not have permission to add a product.' };
    }
  }
}

export default AddProductRequest;
