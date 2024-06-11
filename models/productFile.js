import mongoose from "mongoose";

const productFileSchema = mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    file_path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductFile = mongoose.model("ProductFile", productFileSchema);

export default ProductFile;
