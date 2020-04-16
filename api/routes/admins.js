const express = require("express");
const router = express.Router();
const checkAdmin=require('../middleware/check-admin');
const checkAuth=require('../middleware/check-auth');


const AdminsController=require('../controllers/admins');

router.post("/login", AdminsController.login);

router.post("/add-admin",checkAuth, checkAdmin, AdminsController.add_admin);

router.delete("/:adminId",checkAuth, checkAdmin, AdminsController.delete_admin);

module.exports=router;