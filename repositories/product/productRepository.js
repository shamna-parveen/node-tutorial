import Product from '../../models/product.js';
import ProductFile from '../../models/productFile.js';

export default class ProductRepository {
  /**
   * Create a new product in the database.
   * @param {Object} productData - The product data to save.
   * @returns {Object} - The saved product.
   */
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  /**
   * Create new product files in the database.
   * @param {Array} productFilesData - The product files data to save.
   * @returns {Array} - The saved product files.
   */
  async createProductFiles(productFilesData) {
    try {
      const productFiles = await ProductFile.insertMany(productFilesData);
      return productFiles;
    } catch (error) {
      throw new Error(`Error creating product files: ${error.message}`);
    }
  }

  /**
   * Get a product by its name.
   * @param {String} productName - The name of the product to find.
   * @returns {Object|null} - The found product or null if not found.
   */
  async getProductByName(productName) {
    try {
      return await Product.findOne({ product_name: productName });
    } catch (error) {
      throw new Error(`Error finding product by name: ${error.message}`);
    }
  }
}
