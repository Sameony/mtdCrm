const express = require("express")
var router = express.Router();
var bodyParser = require("body-parser")
const LoginController = require("../controllers/loginController")


var jsonParser = bodyParser.json()
const loginController = new LoginController()

router.post("/addUser", jsonParser, loginController.addUser)

module.exports = router