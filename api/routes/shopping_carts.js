const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');


const CartController =require('../controllers/shopping_carts');

router.post("/",checkAuth, CartController.add_product_to_cart);

router.get("/",checkAuth, CartController.get_cart);

router.delete("/", checkAuth, CartController.remove_product_from_cart);

router.patch("/:productId", checkAuth, CartController.edit_product_quantity);




module.exports = router;