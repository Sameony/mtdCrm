const Order = require('../config/models/orderModel');
const Payments = require("../config/models/paymentModel");
const customerServices = require('./customerService');
const productServices = require('./productService');

const orderServices = {
    addOrder: async (data) => {
        try {
            // console.log(data)
            const newOrder = await Order.create(data);
            return newOrder;
        } catch (error) {
            throw error;
        }
    },
    getOrderById: async (id) => {
        try {
            const order = await Order.findById(id);
            // console.log(order.products)
            let products = await productServices.getProductNames(order.products);
            let customer = await customerServices.getCustomerById(order.customer);
            return {order, products, customer};
        } catch (error) {
            throw error;
        }
    },
    updateOrderById: async(id,data)=>{
        try {
            const order = await Order.findByIdAndUpdate(id, data);
            return order;
        } catch (error) {
            throw error;
        }
    },
    getAllOrders: async () => {
        try {
            const base_orders = await Order.find();
            const orders = await Promise.all(
                base_orders.map(async (order)=>{
                    let customer = await customerServices.getCustomerById(order.customer);
                    let products = await productServices.getProductNames(order.products);
                    let payments = await orderServices.getPaymentsByOrderId(order._id)
                    // console.log(customer, products, payments)
                    return {order, customer, products, payments}
                })
            )
            return orders;
        } catch (error) {
            throw error;
        }
    },
    addPaymentToOrderId : async (id, data) => {
        try {
            const order = await Order.findById(id);
            if (!order) throw new Error("No such order found.");
            if (order.due_amount === 0) throw new Error("No due amount on this order.");
    
            const totalPaymentAmount = data.reduce((sum, payment) => sum + payment.amount, 0);
    
            if (order.paid_amount + totalPaymentAmount > order.amount_total) {
                throw new Error("Total payment exceeds order amount total.");
            }
    
            const newPayments = await Payments.insertMany(data);
            const newPaymentIds = newPayments.map(payment => payment._id);
    
            order.payments.push(...newPaymentIds);
            order.paid_amount += totalPaymentAmount;
            order.due_amount -= totalPaymentAmount;
    
            await order.save();
    
            return newPayments;
        } catch (error) {
            console.log(error);
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
                return {payments, due_amount:order.due_amount}
            }
            else {
                return {payments:[], due_amount:order.due_amount}
            }
        } catch (error) {
            throw error;
        }
    },
    updatePaymentById: async (id, data) => {
        try {
            const payment = await Payments.findByIdAndUpdate(id, data);
            return payment;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = orderServices;
