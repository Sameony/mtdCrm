const Product = require('../config/models/ProductModel');

const productServices = {
    addProduct: async (data) => {
        try {
            const newProduct = await Product.create(data);
            return newProduct;
        } catch (error) {
            throw error;
        }
    },
    getProductById: async (id) => {
        try {
            const product = await Product.findById(id);
            return product;
        } catch (error) {
            throw error;
        }
    },
    getAllProducts: async () => {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = productServices;
