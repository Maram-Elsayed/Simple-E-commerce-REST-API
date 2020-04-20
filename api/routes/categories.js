const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const CategoryController =require('../controllers/categories');
const checkAdmin=require('../middleware/check-admin');

router.post("/",checkAuth, checkAdmin,CategoryController.check_validation ,CategoryController.create_category);

router.post("/:categoryId",checkAuth, checkAdmin,CategoryController.getCategory ,CategoryController.add_product_to_category);

router.get("/:categoryId",checkAuth,CategoryController.getCategory ,CategoryController.get_category_products, CategoryController.display_category_products);

router.delete("/:categoryId",checkAuth, checkAdmin,CategoryController.delete_category);

router.get("/",checkAuth, CategoryController.view_all_categories);

router.get("/category-list/:categoryId",checkAuth, CategoryController.view_subcategories);

module.exports = router;