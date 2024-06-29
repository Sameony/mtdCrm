const Supplier = require("../config/models/supplierModel");
const SupplierOrders = require("../config/models/supplierOrderModel");
const excelService = require("./excelService");

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
    bulkUpload: async (file) =>{
        try {
            if (file.mimetype === 'text/csv') {
                return excelService.parseCSV(file.path, async (data) => {
                //   console.log(data);
                  return await Supplier.insertMany(data)
                });
              } else if (
                file.mimetype ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              ) {
                // console.log('here')
                const data = excelService.parseExcel(file.path);
                // console.log(data);
                return await Supplier.insertMany(data)
              } else {
                throw new Error('Unsupported file type.');
              }
            // return await Supplier.insertMany(suppliers, { ordered: false });
        } catch (error) {
            console.log(error)
            throw new Error('Bulk upload failed: ' + error.message);
        }
    },
        updateSupplier: async (id, supplierData) => {
        try {
            return await Supplier.findByIdAndUpdate(id, supplierData, { new: true });
        } catch (error) {
            throw error;
        }
    },


    addSupplierOrder: async (supplierOrderData) => {
        try {
            const supplierOrder = new SupplierOrders(supplierOrderData);
            return await supplierOrder.save();
        } catch (error) {
            throw error;
        }
    },

    getSupplierOrderById: async (id) => {
        try {
            return await SupplierOrders.findById(id);
        } catch (error) {
            throw error;
        }
    },

    getAllSupplierOrders: async () => {
        try {
            // console.log("HI");
            const supplierOrders = await SupplierOrders.find()
                .populate('supplierID')
                .populate({
                    path: 'orderID',
                    populate: {
                        path: 'products.product_id',
                    },
                });
            // console.log(supplierOrders);
            return supplierOrders.map(supplierOrder => ({
                ...supplierOrder._doc,
                supplier: supplierOrder.supplierID,
                order: {
                    ...supplierOrder.orderID._doc,
                    products: supplierOrder.orderID.products.map(orderProduct => {
                        const product = orderProduct.product_id._doc;
                        return {
                            ...product,
                            children: product.children.filter(child => child.SKU === orderProduct.SKU),
                            quantity: orderProduct.quantity
                        };
                    }).filter(product => product.children.length > 0)
                },
                poID: supplierOrder.poID,
                createdAt: supplierOrder.createdAt,
                updatedAt: supplierOrder.updatedAt,
            }));
        } catch (error) {
            console.log(error);
            throw error;
        }
    },


    updateSupplierOrder: async (id, supplierOrderData) => {
        try {
            return await SupplierOrders.findByIdAndUpdate(id, supplierOrderData, { new: true });
        } catch (error) {
            throw error;
        }
    },

    getSupplierIdByName: async (name) => {
        const supplier = await Supplier.findOne({ name: name.trim() });
        // console.log(supplier, name, "\n------\n")
        if (!supplier) {
            supplier = await Supplier.findOne({ name: "MEGA IMPORTS BRAMPTON" });
            // console.log(supplier, 2, "\n------\n")
        }
        return supplier ? supplier._id : null;
    },
};

module.exports = supplierServices;
