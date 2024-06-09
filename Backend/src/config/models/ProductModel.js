const mongoose = require("mongoose")

const sizeSchema = new mongoose.Schema({
    L: { type: Number, required: true },
    W: { type: Number, required: true },
    H: { type: Number, required: true }
});

var ProductSchema = new mongoose.Schema(
    {
        SKU: { type: String, required: true, unique: true, trim: true },
        name: { type: String, required: true, trim: true },
        color: { type: String, required: true, trim: true },
        selling_price: { type: Number, required: true, trim: true },
        sale_price: { type: Number, required: true, trim: true },
        cost_price: { type: Number, required: true, trim: true },
        product_size: { type: sizeSchema, required: true },
        shipping_size: { type: sizeSchema, required: true },
        weight: { type: Number, required: true, trim: true },
        status: {
            type: String,
            enum: ['in stock', 'out of stock', 'discontinued'],
            required: true
        },
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model("Products", ProductSchema)
module.exports = Product