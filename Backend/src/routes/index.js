const express = require("express")
var router = express.Router();
var bodyParser = require("body-parser")
const loginController = require("../controllers/loginController")


const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const customerController = require('../controllers/customerController');

var jsonParser = bodyParser.json()

router.post("/addUser", jsonParser, loginController.addUser)
router.post("/loginUser", jsonParser, loginController.loginUser)


router.post('/addCustomer', jsonParser, customerController.addCustomer);
router.get('/getCustomerById/:id', jsonParser, customerController.getCustomerById);
router.get('/getCustomers', jsonParser, customerController.getAllCustomers);


router.post("/addProduct", jsonParser, productController.addProduct);
router.get("/products/:id", jsonParser, productController.getProductById);
router.get("/products", jsonParser, productController.getAllProducts);
router.put("/updateProductById/:id", jsonParser, productController.updateProduct);
router.delete("/DeleteProductById/:id", jsonParser, productController.deleteProduct);

router.post('/addOrder', jsonParser, orderController.addOrder);
router.post('/getOrderById/:id', jsonParser, orderController.getOrderById);
router.get('/getAllOrders', jsonParser, orderController.getAllOrders);

module.exports = router