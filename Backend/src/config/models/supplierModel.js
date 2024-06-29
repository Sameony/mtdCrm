// models/ImportCompany.js

const mongoose = require('mongoose');
const addressSchema = require('./addressModel');
const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber1: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber2: {
        type: String,
    },
    emailID: {
        type: String,
        required: true,
        unique: true
    },
    pickupLocation: {
        type: addressSchema,
        required: true,
    },
    pickupGoogleMapLink: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        // enum: ["Location" | "Supplier"],
        default: "Supplier"
    }
});
const Supplier = mongoose.model('Suppliers', SupplierSchema);
module.exports = Supplier
