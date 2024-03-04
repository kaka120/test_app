const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const UserController = require('../controllers/user.controller');
const AuthController = require('../controllers/auth.controller');
//const RequestController = require('../controllers/request.controller');
 


router.get("/users",auth,UserController.get);
router.get("/users/:id",auth,UserController.get);
router.post("/user",UserController.create);
router.post("/login",AuthController.login);
router.get("/delete/:id",auth,UserController.del);
router.post("/update/:id",auth,UserController.updateUpdated);
//router.post("/addtag",RequestController.addtag);


module.exports = router;