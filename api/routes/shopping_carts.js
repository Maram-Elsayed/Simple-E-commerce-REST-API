const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const CartController =require('../controllers/shopping_carts');
const OrderController =require('../controllers/orders');


router.post("/",checkAuth, CartController.find_cart,CartController.add_product_to_cart, CartController.get_cart_products, CartController.display_cart_products);

router.get("/",checkAuth, CartController.find_cart, CartController.get_cart_products, CartController.display_cart_products);

router.delete("/", checkAuth, CartController.find_cart, CartController.remove_product_from_cart, CartController.get_cart_products, CartController.display_cart_products);

router.patch("/:productId", checkAuth, CartController.find_cart, CartController.edit_product_quantity, CartController.get_cart_products, CartController.display_cart_products);

router.post("/checkout",checkAuth, CartController.find_cart, CartController.get_cart_products, CartController.checkout);




module.exports = router;