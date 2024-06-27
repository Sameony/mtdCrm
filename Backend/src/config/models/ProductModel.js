const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define sizeSchema
const sizeSchema = new Schema({
  L: { type: Number },
  W: { type: Number },
  H: { type: Number }
}, { _id: false });

const SupplierSchema = new Schema({
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Suppliers' },
  name: { type: String },
}, { _id: false });

const ImageSchema = new mongoose.Schema({
  filename: String,
  path: String
}, { _id: false });

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
  },
  image: { type: ImageSchema }
});

// Define ProductSchema
const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    ID: { type: String, required: true, trim: true, unique: true },
    children: [childSchema],
    supplier: { type: SupplierSchema, required: false },
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
