const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');


const CartController =require('../controllers/shopping_carts');

router.post("/",checkAuth, CartController.add_product_to_cart);

router.get("/",checkAuth, CartController.get_cart);

router.delete("/:cartId", CartController.delete_cart);




module.exports = router;