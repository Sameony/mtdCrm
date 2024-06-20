const Supplier = require("../config/models/supplierModel");

const supplierServices = {
  addSupplier: async (supplierData) => {
    try {
      const supplier = new Supplier(supplierData);
      return await supplier.save();
    } catch (error) {
      throw error;
    }
  },

  getSupplierById: async (id) => {
    try {
      return await Supplier.findById(id);
    } catch (error) {
      throw error;
    }
  },

  getAllSuppliers: async () => {
    try {
      return await Supplier.find();
    } catch (error) {
      throw error;
    }
  },

  updateSupplier: async (id, supplierData) => {
    try {
      return await Supplier.findByIdAndUpdate(id, supplierData, { new: true });
    } catch (error) {
      throw error;
    }
  }
};

module.exports = supplierServices;
