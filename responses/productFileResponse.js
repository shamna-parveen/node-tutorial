export default class ProductFileResponse {
    /**
     * Transform the product file resource into an object.
     *
     * @param {Object} productFile - The product file object to transform.
     * @return {Object} - An object containing selected properties from the product file.
     */
    static format(productFile) {
      return {
        id: productFile._id,
        product_id: productFile.product_id,
        file_path: productFile.file_path,
      };
    }
  }
  