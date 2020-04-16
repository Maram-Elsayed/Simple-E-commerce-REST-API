const mongoose = require("mongoose");
const bcrypt=require('bcrypt');
const jwt = require("jsonwebtoken");

const User= require('../models/user');
const Cart = require("../models/shopping_carts");

exports.signup=(req, res,next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user=>{
        if(user.length>=1){
            return res.status(409).json({
                message: 'Email used'
            })
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  return res.status(500).json({
                    error: err
                  });
                } else {
                  const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                  });
                  req.userData=user;  
                  console.log({message: 'req.userData= '+req.userData});                         
                user.save()
                .then(result => {
                  
                    next();
                  }
                  )
                  .catch(err => {
                    console.log(err);
                    res.status(500).json({
                      error: err
                    });
                  });
                  
            }
            
            });
            

        }
    });
    
};

exports.login=(req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id,
                admin: 0
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

  exports.delete_user=(req, res, next) => {
    User.remove({ _id: req.params.userId })
      .exec()
      .then(result => {
       next();
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };