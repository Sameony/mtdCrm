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
}

module.exports = new SupplierController();
