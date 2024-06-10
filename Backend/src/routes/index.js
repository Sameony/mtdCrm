const express = require("express")
var router = express.Router();
var bodyParser = require("body-parser")
const LoginController = require("../controllers/loginController")


const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const customerController = require('../controllers/customerController');

var jsonParser = bodyParser.json()
const loginController = new LoginController()

router.post("/addUser", jsonParser, loginController.addUser)
router.post("/loginUser", jsonParser, loginController.loginUser)


router.post('/', customerController.addCustomer);
router.get('/:id', customerController.getCustomerById);
router.get('/', customerController.getAllCustomers);


router.post('/', productController.addProduct);
router.get('/:id', productController.getProductById);
router.get('/', productController.getAllProducts);

router.post('/', orderController.addOrder);
router.get('/:id', orderController.getOrderById);
router.get('/', orderController.getAllOrders);

module.exports = router