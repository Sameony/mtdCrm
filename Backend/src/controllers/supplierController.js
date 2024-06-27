const supplierServices = require("../services/supplierService");

class SupplierController {
    addSupplier = async (req, res, next) => {
        try {
            const supplier = await supplierServices.addSupplier(req.body);
            return res.json({ status: true, data: supplier, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error });
        }
    };

    getSupplierById = async (req, res, next) => {
        try {
            const supplier = await supplierServices.getSupplierById(req.params.id);
            if (supplier) {
                return res.json({ status: true, data: supplier, err: {} });
            } else {
                return res.json({ status: false, data: {}, err: "Supplier not found" });
            }
        } catch (error) {
            return res.json({ status: false, data: {}, err: error });
        }
    };

    getAllSuppliers = async (req, res, next) => {
        try {
            const suppliers = await supplierServices.getAllSuppliers();
            return res.json({ status: true, data: suppliers, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error });
        }
    };

    updateSupplier = async (req, res, next) => {
        try {
            const supplier = await supplierServices.updateSupplier(req.params.id, req.body);
            return res.json({ status: true, data: supplier, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error });
        }
    };

    // orders

    addSupplierOrder = async (req, res, next) => {
        try {
            const supplierOrder = await supplierServices.addSupplierOrder(req.body);
            return res.json({ status: true, data: supplierOrder, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error });
        }
    };

    getSupplierOrderById = async (req, res, next) => {
        try {
            const supplierOrder = await supplierServices.getSupplierOrderById(req.params.id);
            if (supplierOrder) {
                return res.json({ status: true, data: supplierOrder, err: {} });
            } else {
                return res.json({ status: false, data: {}, err: "Supplier order not found" })
            }
        } catch (error) {
            return res.json({ status: false, data: {}, err: error });
        }
    };

    getAllSupplierOrders = async (req, res, next) => {
        try {
            const orders = await supplierServices.getAllSupplierOrders();
            return res.json({ status: true, data: orders, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error });
        }
    };

    multiUploadSuppliers = async (req, res) => {
        try {
            const suppliers = req.file
            // console.log(suppliers)
            let response = await supplierServices.bulkUpload(suppliers);
            if(response)
                return res.json({ status: true, data: response, err: {} });
            else
                throw new Error("Something went wrong. Please double check the file format.")
        } catch (error) {
            return res.json({ status: false, data: {}, err: error });
        }
    };

}

module.exports = new SupplierController();
