const mongoose = require("mongoose");
const bcrypt=require('bcrypt');
const jwt = require("jsonwebtoken");

const Admin= require('../models/admin');


exports.login=(req, res, next) => {
    Admin.find({ username: req.body.username })
      .exec()
      .then(admin => {
        if (admin.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                username: admin[0].email,
                adminId: admin[0]._id,
                admin: 1
              },process.env.MONGO_ATLAS_PW ,
              {
                  expiresIn: "24h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

exports.add_admin=(req, res,next)=>{
    Admin.find({username: req.body.username})
    .exec()
    .then(admin=>{
        if(admin.length>=1){
            return res.status(409).json({
                message: 'Username used'
            })
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  return res.status(500).json({
                    error: err
                  });
                } else {
                  const admin = new Admin({
                    _id: new mongoose.Types.ObjectId(),
                    username: req.body.username,
                    password: hash
                  });
                                           
                admin.save()
                }
             });
        }
    });
};

exports.delete_admin=(req,res,next)=>{
  Admin.remove({_id: req.param.adminId})
  .exec()
      .then(result => {
       return res.status(200).json({message: "Adim deleted"});
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
}