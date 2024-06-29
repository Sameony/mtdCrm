const mongoose = require("mongoose")
const addressSchema = require("./addressModel")

const ProductRefSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    SKU: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, default: 1 }

})

var OrderSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', required: true },
        products: [{ type: ProductRefSchema, required: true }],
        ship_method: {
            type: String,
            enum: ['MTD Shipping', 'Store Pickup'],
            required: true
        },
        ship_address: { type: addressSchema },
        comment: { type: String },
        added_cost: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        amount_total: { type: Number, required: true },
        due_amount: { type: Number, required: true },
        paid_amount: { type: Number, required: true },
        sub_total: { type: Number },
        status: {
            type: String,
            enum: ['Processing', 'Completed', 'Cancelled', 'Refund Initiated', 'Refund Completed', 'Partially Completed'],
            required: true
        },
        payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payments' }],
        expected_delivery: { type: Date, required: true }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model("Orders", OrderSchema)
module.exports = Order