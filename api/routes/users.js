const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');

const UsersController=require('../controllers/users');
const CartController =require('../controllers/shopping_carts');

router.post('/signup', UsersController.signup,CartController.create_cart);

router.post("/login", UsersController.login);
  
router.delete("/:userId",checkAuth, UsersController.delete_user, CartController.delete_cart);


  

module.exports = router;