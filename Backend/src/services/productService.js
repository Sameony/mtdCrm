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
  getProductNames: async (prod_data) => {
    try {
      const products = await Promise.all(prod_data.map(async prod => {
        // console.log(prod,"aha")
        let parent = await Product.findById(prod.product_id).catch(err=>console.log)
        // console.log(parent,"here")
        if(!parent)
          throw new Error("Product not found")
        let child = parent.children.filter(child => child.SKU === prod.SKU)
        return { ...child, quantity: prod.quantity, parent_name:parent.name, ...prod._doc }
      }))
      return products
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
