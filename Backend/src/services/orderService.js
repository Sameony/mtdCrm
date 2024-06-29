const { default: mongoose } = require('mongoose');
const Product = require('../config/models/ProductModel');
const Order = require('../config/models/orderModel');
const Payments = require("../config/models/paymentModel");
const SupplierOrder = require('../config/models/supplierOrderModel');
const customerServices = require('./customerService');
const productServices = require('./productService');

const orderServices = {
    addOrder: async (data) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Create the order
            const newOrder = await Order.create([data], { session });

            // Extract products from the order data
            const products = data.products; // Adjust according to your data structure

            // Create a map to store suppliers and their respective products
            const supplierMap = new Map();
            console.log("here")
            // Iterate through each product to organize by supplier
            for (const productRef of products) {
                // console.log(productRef)
                const product = await Product.findById(productRef.product_id).populate("supplier").session(session);
                // console.log(product)
                if (product && product.supplier) {
                    const supplierID = product.supplier.supplier_id?.toString(); // Ensure string comparison
                    if (!supplierMap.has(supplierID)) {
                        supplierMap.set(supplierID, { name: product.supplier.name, products: [] });
                    }
                    supplierMap.get(supplierID).products.push(productRef);
                }
            }

            // Create supplier orders
            const supplierOrderPromises = [];
            supplierMap.forEach((supplierData, supplierID) => {
                const poID = `${newOrder[0]._id}-${supplierData.name.replace(/\s+/g, '')}`;
                const orderID = newOrder[0]._id;
                const supplierOrderData = {
                    supplierID: supplierID,
                    poID: poID,
                    orderID
                };
                supplierOrderPromises.push(SupplierOrder.create([supplierOrderData], { session }));
            });

            // Wait for all supplier orders to be created
            await Promise.all(supplierOrderPromises);

            await session.commitTransaction();
            session.endSession();

            return newOrder[0]; // Since create returns an array in session
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    },

    getOrderById: async (id) => {
        try {
            const order = await Order.findById(id);
            // console.log(order.products)
            let products = await productServices.getProductNames(order.products);
            let customer = await customerServices.getCustomerById(order.customer);
            return { order, products, customer };
        } catch (error) {
            throw error;
        }
    },
    updateOrderById: async (id, data) => {
        try {
            const order = await Order.findByIdAndUpdate(id, data);
            return order;
        } catch (error) {
            throw error;
        }
    },
    getAllOrders: async () => {
        try {
            const base_orders = await Order.find().populate('customer').populate('products').populate('payments');
            // console.log(base_orders)
            return base_orders;
        } catch (error) {
            throw error;
        }
    },
    addPaymentToOrderId: async (id, data) => {
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
                return { payments, due_amount: order.due_amount }
            }
            else {
                return { payments: [], due_amount: order.due_amount }
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
