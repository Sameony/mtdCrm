const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SupplierOrderSchema = new Schema({
    supplierID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Suppliers',
        required: true,
    },
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders',
        required: true,
    },
    poID: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true
});

const SupplierOrder = mongoose.model('SupplierOrder', SupplierOrderSchema);
module.exports = SupplierOrder;
