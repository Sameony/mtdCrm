const Customer = require('../config/models/customerModel');

const customerServices = {
    addCustomer: async (data) => {
        try {
            let isDuplicate = await Customer.find({email:data.email})
            if(isDuplicate.length>0)
                throw new Error("Customer has already been registered.")
            const newCustomer = await Customer.create(data);
            return newCustomer;
        } catch (error) {
            throw error;
        }
    },
    getCustomerById: async (id) => {
        try {
            const customer = await Customer.findById(id);
            return customer;
        } catch (error) {
            throw error;
        }
    },
    getAllCustomers: async () => {
        try {
            const customers = await Customer.find();
            return customers;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = customerServices;
