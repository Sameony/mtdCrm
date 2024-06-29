const mongoose = require("mongoose")
const addressSchema = new mongoose.Schema({
    address: { type: String, required: true },
    longitude: { type: String, required: true },
    latitude: { type: String, required: true },
}, { id: false })

module.exports = addressSchema