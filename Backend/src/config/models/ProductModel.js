const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define sizeSchema
const sizeSchema = new Schema({
  L: { type: Number },
  W: { type: Number },
  H: { type: Number }
});

// Define childSchema
const childSchema = new Schema({
  SKU: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  color: { type: String, required: true, trim: true },
  selling_price: { type: Number, required: true },
  sale_price: { type: Number, required: true },
  cost_price: { type: Number, required: true },
  product_size: { type: sizeSchema },
  shipping_size: { type: sizeSchema },
  weight: { type: Number },
  status: {
    type: String,
    enum: ['in stock', 'out of stock', 'discontinued'],
    required: true
  }
});

// Define ProductSchema
const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    ID: { type: String, required: true, trim: true, unique: true },
    children: [childSchema]
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
