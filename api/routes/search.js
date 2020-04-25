const express = require("express");
const router = express.Router();
const SearchController =require('../controllers/search');
const CategoryController =require('../controllers/categories');

router.get("/", SearchController.search_product, SearchController.display_search_results);
router.get("/category",CategoryController.getCategory , SearchController.search_product_in_category, SearchController.display_products_in_category_search)









module.exports = router;