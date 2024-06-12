const mongoose = require("mongoose")

var PaymentSchema = new mongoose.Schema(
    {
        mode: {
            type: String,
            enum: ['Online', 'Interac', 'Finance', 'Cash', 'Card'],
            required: true
        },
        amount: { type: Number, required: true },
        txn_id: { type: String, trim: true },
        link: { type: String, trim: true },
        sender_name: { type: String, trim: true },
        sender_email: { type: String, trim: true },
        institution_name: { type: String, trim: true },
        finance_id: { type: String, trim: true },

    },
    { timestamps: true }
)

const Payment = mongoose.model("Payments", PaymentSchema)
module.exports = Payment