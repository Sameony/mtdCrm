const customerServices = require('../services/customerService');

class CustomerController {
    addCustomer = async (req, res, next) => {
        try {
            const newCustomer = await customerServices.addCustomer(req.body);
            return res.status(201).json({ status: true, data: newCustomer, err: {} });
        } catch (error) {
            return res.status(400).json({ status: false, data: {}, err: error.message });
        }
    }

    getCustomerById = async (req, res, next) => {
        try {
            const customer = await customerServices.getCustomerById(req.params.id);
            return res.json({ status: true, data: customer, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error.message });
        }
    }

    getAllCustomers = async (req, res, next) => {
        try {
            const customers = await customerServices.getAllCustomers();
            return res.json({ status: true, data: customers, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error.message });
        }
    }
}

module.exports = new CustomerController();
