import ProductFileResponse from './productFileResponse.js';

export default class ProductResponse {
  /**
   * Transform the product resource into an object.
   *
   * @param {Object} product - The product object to transform.
   * @param {Array} productFiles - An array of product file objects associated with the product.
   * @return {Object} - An object containing selected properties from the product.
   */
  static async format(product, productFiles) {
    return {
      id: product._id,
      product_name: product.product_name,
      creatable_id: product.creatable_id,
      files: await Promise.all(productFiles.map(file => ProductFileResponse.format(file))),
    };
  }
}
