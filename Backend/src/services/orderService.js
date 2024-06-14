const Order = require('/src/config/models/orderModel');
const Payments = require("/src/config/models/paymentModel")

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
    },
    addPaymentToOrderId: async (id, data) => {
        try {
            // console.log(data)
            const order = await Order.findById(id);
            if (!order)
                throw new Error("No such order found.")
            if(order.due_amount===0)
                throw new Error("No due amount on this order.")
            if (data.length > 1) {
                await Promise.all(data.map(async (pays) => {
                    let new_pay = await Payments.create(pays)
                    await Order.findByIdAndUpdate(id, { payments: [...order.payments, new_pay._id], due_amount: order.due_amount - pays.amount })
                    return new_pay
                }))
            }
            else {
                data=data[0]
                let new_pay = await Payments.create(data)
                await Order.findByIdAndUpdate(id, { payments: [...order.payments, new_pay._id], due_amount: order.due_amount - data.amount })
                return new_pay
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    },
    getPaymentsByOrderId: async (id) => {
        try {
            const order = await Order.findById(id);
            if (order.payments.length > 0) {
                let payments = await Promise.all(order.payments.map(async (item) => {
                    let payment = await Payments.findById(item)
                    return payment
                }))
                return payments
            }
            else {
                return []
            }
        } catch (error) {
            throw error;
        }
    },
    updatePaymentById: async (id, data) => {
        try {
            const payment = await Order.findByIdAndUpdate(id, data);
            return payment;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = orderServices;
