const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');

const OrdersController =require('../controllers/orders');
const CartController =require('../controllers/shopping_carts');

// Handle incoming GET requests to /orders
router.get("/",checkAuth, OrdersController.orders_get_all);

router.get("/:orderId",checkAuth, OrdersController.order_get_by_id, OrdersController.display_order);

router.delete("/:orderId",checkAuth, OrdersController.delete_order);

module.exports = router;