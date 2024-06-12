const productServices = require("../services/productService");

class ProductController {
  addProduct = async (req, res, next) => {
    try {
      const product = await productServices.addProduct(req.body);
      return res.json({ status: true, data: product, err: {} });
    } catch (error) {
      return res.json({ status: false, data: {}, err: error });
    }
  };

  getProductById = async (req, res, next) => {
    try {
      const product = await productServices.getProductById(req.params.id);
      if (product) {
        return res.json({ status: true, data: product, err: {} });
      } else {
        return res.json({ status: false, data: {}, err: "Product not found" });
      }
    } catch (error) {
      return res.json({ status: false, data: {}, err: error });
    }
  };

  getAllProducts = async (req, res, next) => {
    try {
      const products = await productServices.getAllProducts();
      return res.json({ status: true, data: products, err: {} });
    } catch (error) {
      return res.json({ status: false, data: {}, err: error });
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const product = await productServices.updateProduct(req.params.id, req.body);
      return res.json({ status: true, data: product, err: {} });
    } catch (error) {
      return res.json({ status: false, data: {}, err: error });
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      await productServices.deleteProduct(req.params.id);
      return res.json({ status: true, data: {}, err: {} });
    } catch (error) {
      return res.json({ status: false, data: {}, err: error });
    }
  };
}

module.exports = new ProductController();
