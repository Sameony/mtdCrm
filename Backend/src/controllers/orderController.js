const orderServices = require('../services/orderService');

class OrderController {
    addOrder = async (req, res, next) => {
        try {
            const newOrder = await orderServices.addOrder(req.body);
            return res.json({ status: true, data: newOrder, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error.message });
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
}

module.exports = new OrderController();
