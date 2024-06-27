const productServices = require("../services/productService");
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');

class ProductController {
  addProduct = async (req, res, next) => {
    try {
      const childrenData = JSON.parse(req.body.childrenData)
      // console.log(childData,typeof childData)
      const productData = JSON.parse(req.body.productData);
      // const childrenData = childData.map(child => JSON.parse(child));

      // Process uploaded files
      const childrenImages = req.files.map(file => ({
        filename: file.filename,
        path: file.path
      }));

      // Combine data
      const fullProductData = {
        ...productData,
        children: childrenData.map((child, index) => ({
          ...child,
          image: childrenImages[index]
        }))
      };

      const product = await productServices.addProduct(fullProductData);
      return res.json({ status: true, data: product, err: {} });
    } catch (error) {
      return res.json({ status: false, data: {}, err: error.message });
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
      const childrenData = JSON.parse(req.body.childrenData)
      const productData = JSON.parse(req.body.productData);
      const childrenImages = req.files.map(file => ({
        filename: file.filename,
        path: file.path
      }));
      const fullProductData = {
        ...productData,
        children: childrenData.map((child, index) => ({
          ...child,
          image: childrenImages[index]
        }))
      };
      // console.log(fullProductData,req.params.id)
      const product = await productServices.updateProduct(req.params.id, fullProductData);
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

  bulkUpload = async (req, res, next) => {
    try {
      const file = req.file;
      console.log(file)
      let response = await productServices.bulkUpload(file)
      return res.json({ status: true, data: response, err: {} });
    } catch (error) {
      return res.json({ status: false, data: {}, err: error });
    }
  }
}

module.exports = new ProductController();
