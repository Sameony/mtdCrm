const express = require("express")
var router = express.Router();
var bodyParser = require("body-parser")
const loginController = require("../controllers/loginController")

const SupplierController = require("../controllers/supplierController");
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const customerController = require('../controllers/customerController');
const RouteController = require("../controllers/routeController")
const { imageUpload, fileUpload } = require("../config/multerConfig");


var jsonParser = bodyParser.json()

router.post("/addUser", jsonParser, loginController.addUser)
router.post("/loginUser", jsonParser, loginController.loginUser)

router.post('/addCustomer', jsonParser, customerController.addCustomer);
router.get('/getCustomerById/:id', jsonParser, customerController.getCustomerById);
router.get('/getCustomers', jsonParser, customerController.getAllCustomers);

router.post("/addProduct", jsonParser, imageUpload.array('childrenImages'), productController.addProduct);
router.get("/products/:id", jsonParser, productController.getProductById);
router.get("/products", jsonParser, productController.getAllProducts);
router.post("/updateProductById/:id", jsonParser, imageUpload.array('childrenImages'), productController.updateProduct);
router.delete("/DeleteProductById/:id", jsonParser, productController.deleteProduct);
router.post('/uploadBulk', jsonParser, fileUpload.single('file'), productController.bulkUpload)

router.post('/addOrder', jsonParser, orderController.addOrder);
router.post('/getOrderById/:id', jsonParser, orderController.getOrderById);
router.post('/updateOrder/:id', jsonParser, orderController.updateOrderById);
router.get('/getAllOrders', jsonParser, orderController.getAllOrders);
router.get('/getPaymentByOrderId/:id', jsonParser, orderController.getPaymentsByOrderId);
router.post('/updatePaymentById/:id', jsonParser, orderController.updatePaymentById);
router.post('/addPaymentToOrderId/:id', jsonParser, orderController.addPaymentToOrderId);

router.post("/suppliers", jsonParser, SupplierController.addSupplier);
router.post('/uploadMultiSuppliers',jsonParser, fileUpload.single('file'), SupplierController.multiUploadSuppliers);
router.get("/suppliers/:id", jsonParser, SupplierController.getSupplierById);
router.get("/suppliers", jsonParser, SupplierController.getAllSuppliers);
router.post("/updateSupplierById/:id", jsonParser, SupplierController.updateSupplier);
router.post("/supplyOrders", jsonParser, SupplierController.addSupplierOrder);
router.get("/supplyOrders/:id", jsonParser, SupplierController.getSupplierOrderById);
router.get("/supplyOrders", jsonParser, SupplierController.getAllSupplierOrders);

router.post('/routes', jsonParser, RouteController.createRoute);
router.get('/routes', jsonParser, RouteController.getAllRoutes);
router.get('/routes/:id', jsonParser, RouteController.getRouteById);
router.post('/updateRoutes/:id', jsonParser, RouteController.updateRoute);
// router.post('/OProutes', jsonParser, RouteController.createOptimizedRoute);
// router.get('/OProutes', jsonParser, RouteController.getOptimizedRoutes);
// router.get('/OProutes/:id', jsonParser, RouteController.getOptimizedRouteById);


module.exports = router