const productServices = require('../services/productService');

class ProductController {
    addProduct = async (req, res, next) => {
        try {
            const newProduct = await productServices.addProduct(req.body);
            return res.json({ status: true, data: newProduct, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error.message });
        }
    }

    getProductById = async (req, res, next) => {
        try {
            const product = await productServices.getProductById(req.params.id);
            return res.json({ status: true, data: product, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error.message });
        }
    }

    getAllProducts = async (req, res, next) => {
        try {
            const products = await productServices.getAllProducts();
            return res.json({ status: true, data: products, err: {} });
        } catch (error) {
            return res.json({ status: false, data: {}, err: error.message });
        }
    }
}

module.exports = new ProductController();
