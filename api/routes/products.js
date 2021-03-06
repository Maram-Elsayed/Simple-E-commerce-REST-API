const express = require("express");
const router = express.Router();
const multer=require('multer');
const checkAuth=require('../middleware/check-auth');
const ProductsController=require('../controllers/products');
const checkAdmin=require('../middleware/check-admin');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-')+ file.originalname);
  }
});

const fileFilter=(req, file, cb)=>{
  if(file.mimetype==='image/jpeg' || file.mimetype==='image/png') {
  cb(null, true);
  }else {
    cb(null, false);
  }
};

const upload= multer({storage: storage, 
  limits: {
  fieldSize: 1024 * 1024 *5
},
fileFilter: fileFilter
});


router.get('/', ProductsController.get_all_products);

router.post("/",checkAuth,checkAdmin,upload.single('productImage'), ProductsController.add_product);

router.get('/:productId',ProductsController.get_product);

router.patch('/:productId' ,checkAuth, checkAdmin,ProductsController.edit_product);

router.delete('/:productId',checkAuth, checkAdmin,ProductsController.delete_product);

module.exports=router;