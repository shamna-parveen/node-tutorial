import AddProductRequest from "../requests/product/addProductRequest.js";
import ProductRepository from "../repositories/product/productRepository.js";
import DeleteProductRequest from "../requests/product/deleteproductRequest.js";

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

      res
        .status(201)
        .json({ message: "Product and images saved successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ errors: error.message });
    }
  }
  /**
   * delete product
   *
   * @swagger
   * /product/delete:
   *   post:
   *     tags:
   *       - Products
   *     summary: delete product by id
   *     security:
   *       - jwt: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: query
   *         name: id
   *         type: string
   *         description: Enter product id
   *     responses:
   *       200:
   *         description: Success
   *       422:
   *         description: Unprocessable Entity
   *       401:
   *         description: Unauthenticated
   */
  async deleteProduct(req, res) {
    try {
      const deleteRequest = new DeleteProductRequest(req);
      const validatedData = await deleteRequest.validate();

      // Retrieve product files
      const productFiles = await productRepo.getProductFiles(validatedData.id);

      // Delete the product
      const deleteData = await productRepo.deleteProduct(validatedData.id);
      if (deleteData) {
        // Delete product files after the product has been deleted
        await productRepo.deleteProductFiles(validatedData.id);

        res.status(200).json({
          status: true,
          message: "Product and associated files deleted successfully.",
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Unable to delete product.",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(422).json({
        status: false,
        message: "Unable to delete product.",
        errors: error,
      });
    }
  }
}
