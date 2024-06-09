const Order = require('../config/models/orderModel');

const orderServices = {
    addOrder: async (data) => {
        try {
            const newOrder = await Order.create(data);
            return newOrder;
        } catch (error) {
            throw error;
        }
    },
    getOrderById: async (id) => {
        try {
            const order = await Order.findById(id);
            return order;
        } catch (error) {
            throw error;
        }
    },
    getAllOrders: async () => {
        try {
            const orders = await Order.find();
            return orders;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = orderServices;
