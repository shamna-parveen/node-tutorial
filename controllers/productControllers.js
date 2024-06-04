import AddProductRequest from '../requests/product/addProductRequest.js';
import ProductRepository from '../repositories/product/productRepository.js';

const productRepo = new ProductRepository();

export default class productControllers {
  /**
   * @swagger
   * /product/add:
   *   post:
   *     tags:
   *       - Products
   *     summary: Add product with multiple images
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               product_name:
   *                 type: string
   *                 description: Enter product name
   *                 example: "Sample Product"
   *               images:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: binary
   *                 description: Upload product images
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 files:
   *                   type: array
   *                   items:
   *                     type: string
   *       400:
   *         description: Bad Request
   *       500:
   *         description: Internal Server Error
   */
  async addProduct(req, res) {
    const addProductRequest = new AddProductRequest(req);

    try {
      const validatedData = await addProductRequest.validate();

      // Create and save the product
      const productData = {
        product_name: validatedData.product_name,
        creatable_id: req.session.user.id.toString(),
      };
      const savedProduct = await productRepo.createProduct(productData);

      // Save each image with a reference to the product
      const productFiles = req.files.map((file) => ({
        product_id: savedProduct._id,
        file_path: file.path,
      }));

      await productRepo.createProductFiles(productFiles);

      res.status(201).json({ message: 'Product and images saved successfully' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ errors: error.message });
    }
  }
}
