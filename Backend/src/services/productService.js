const Product = require("../config/models/ProductModel");

const productServices = {
  addProduct: async (productData) => {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      return await Product.findById(id).populate('children');
    } catch (error) {
      throw error;
    }
  },

  getAllProducts: async () => {
    try {
      return await Product.find().populate('children');
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      return await Product.findByIdAndUpdate(id, productData, { new: true });
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = productServices;
