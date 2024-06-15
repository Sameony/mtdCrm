const orderServices = require('../services/orderService');

class OrderController {
    addOrder = async (req, res, next) => {
        try {
            const newOrder = await orderServices.addOrder(req.body);
            return res.status(201).json({ status: true, data: newOrder, err: {} });
        } catch (error) {
            return res.status(400).json({ status: false, data: {}, err: error.message });
        }
    }

    getOrderById = async (req, res, next) => {
        try {
            const order = await orderServices.getOrderById(req.params.id);
            return res.json({ status: true, data: order, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error.message });
        }
    }

    getAllOrders = async (req, res, next) => {
        try {
            const orders = await orderServices.getAllOrders();
            return res.json({ status: true, data: orders, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error.message });
        }
    }

    addPaymentToOrderId = async (req, res, next) => {
        try {
            const payment = await orderServices.addPaymentToOrderId(req.params.id, req.body);
            return res.json({ status: true, data: payment, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error.message });
        }
    }
    
    getPaymentsByOrderId = async (req, res, next) => {
        try {
            const payment = await orderServices.getPaymentsByOrderId(req.params.id);
            return res.json({ status: true, data: payment, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error.message });
        }
    }
    updatePaymentById = async (req, res, next) => {
        try {
            const payment = await orderServices.updatePaymentById(req.params.id, req.body);
            return res.json({ status: true, data: payment, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error.message });
        }
    }
    updateOrderById = async (req, res, next) => {
        try {
            const order = await orderServices.updateOrderById(req.params.id, req.body);
            return res.json({ status: true, data: order, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error.message });
        }
    }


}

module.exports = new OrderController();
