const mongoose = require("mongoose")
const addressSchema = require("./addressModel")

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    quantity: { type: Number, required: true, min: 1 },
    discount: { type: Number }
});

const CustomerSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, trim: true },
        address: { type: addressSchema },
        firstname: { type: String, required: true, trim: true },
        lastname: { type: String, required: true, trim: true },
        phone: { type: Number, required: true, unique: true },
        cart: [cartItemSchema]
    },
    {
        timestamps: true
    }
)

const Customer = mongoose.model("Customers", CustomerSchema)
module.exports = Customer