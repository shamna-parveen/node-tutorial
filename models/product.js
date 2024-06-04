import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    creatable_id: {
      type: mongoose.Schema.Types.ObjectId, // Change to ObjectId
      required: true,
      ref: 'User' // Assuming this references a User model
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
