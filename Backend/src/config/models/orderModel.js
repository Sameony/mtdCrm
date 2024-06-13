const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: String, required: true },
})

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
        ship_address: { type: addressSchema, required: true },
        comment: { type: String },
        added_cost: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        amount_total: { type: Number, required: true },
        due_amount: { type: Number, required: true },
        paid_amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['Processing', 'Completed', 'Cancelled', 'Refund Initiated', 'Refund Completed'],
            required: true
        },
        payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payments' }],
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model("Orders", OrderSchema)
module.exports = Order