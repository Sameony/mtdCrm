const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: String, required: true },
})
var OrderSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', required: true },
        ship_method: { type: String, required: true, trim: true },
        ship_address: { type: addressSchema, required: true, unique: true, trim: true },
        comment: { type: String },
        added_cost: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        amount_total: { type: Number, required: true },
        due_amount:{ type: Number, required: true },
        paid_amount:{ type: Number, required: true },
        status: {
            type: String,
            enum: ['Processing', 'Completed', 'Cancelled', 'Refund Initiated', 'Refund Completed'],
            required: true
        },
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model("Orders", OrderSchema)
module.exports = Order