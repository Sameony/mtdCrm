const Product = require("../config/models/ProductModel");
const excelService = require("./excelService");
const supplierServices = require("./supplierService");

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
        let parent = await Product.findById(prod.product_id).catch(err => console.log)
        // console.log(parent,"here")
        if (!parent)
          throw new Error("Product not found")
        let child = parent.children.filter(child => child.SKU === prod.SKU)
        return { ...child, quantity: prod.quantity, parent_name: parent.name, ...prod._doc }
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
  },

  bulkUpload: async (file) => {
    try {

      // let products = [];

      if (file.mimetype === 'text/csv') {
        excelService.parseCSV(file.path, async (data) => {
          return await productServices.processProducts(data);

        });
      } else if (
        file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        console.log('here')
        const data = excelService.parseExcel(file.path);
        return await productServices.processProducts(data);
      } else {
        throw new Error('Unsupported file type.');
      }
    } catch (error) {
      throw error;
    }
  },
  processProducts: async (data) => {
    try {
      const productsMap = {};

      for (const item of data) {
        const supplierId = await supplierServices.getSupplierIdByName(item['Parent Supplier Name']);
        const parentID = item['Parent ID'];

        if (!productsMap[parentID]) {
          productsMap[parentID] = {
            name: item['Parent Name'],
            category: item['Parent Category'],
            ID: parentID,
            supplier: supplierId ? { name: item['Parent Supplier Name'], supplier_id: supplierId } : { name: item['Parent Supplier Name'] },
            children: []
          };
        }

        const childProduct = {
          SKU: item['Child SKU'],
          name: item['Child Name'],
          color: item['Child Color'],
          selling_price: item['Child Selling Price'],
          sale_price: item['Child Sale Price'],
          cost_price: item['Child Cost Price'],
          product_size: {
            L: item['Child Product Size L'],
            W: item['Child Product Size W'],
            H: item['Child Product Size H']
          },
          shipping_size: {
            L: item['Child Shipping Size L'],
            W: item['Child Shipping Size W'],
            H: item['Child Shipping Size H']
          },
          weight: item['Child Weight'],
          status: item['Child Status']
        };

        productsMap[parentID].children.push(childProduct);
      }

      const products = Object.values(productsMap);
      await Product.insertMany(products);
    } catch (error) {
      throw error
    }
  }
}

module.exports = productServices;
