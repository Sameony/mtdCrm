const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RouteSchema = new Schema({
    routeName: {
        type: String,
        required: true,
    },
    routeDate: {
        type: Date,
        required: true,
    },
    routeID: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: String,
        required: true,
    },
    sequence: {
        type: Number,
        required: true,
    },
    deliveryStops: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Orders',
        required: true,
    }],
    pickupStops: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SupplierOrder',
        required: true,
    }],
    start: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Suppliers',
        required: true,
    },
    end: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Suppliers',
        required: true,
    },
}, {
    timestamps: true
});

const Route = mongoose.model('Route', RouteSchema);
module.exports = Route;
