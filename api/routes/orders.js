const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const checkAdmin=require('../middleware/check-admin');

const OrdersController =require('../controllers/orders');

// Handle incoming GET requests to /orders
router.get("/",checkAuth, OrdersController.orders_get_all);

router.get("/:orderId",checkAuth, OrdersController.order_get_by_id, OrdersController.display_order);

router.delete("/:orderId",checkAuth, checkAdmin,OrdersController.delete_order);

module.exports = router;