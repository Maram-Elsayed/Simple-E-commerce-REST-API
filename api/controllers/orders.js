const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.orders_get_all= (req, res, next) => {
    Order.find()
      .select("product quantity _id email")
      .populate('product','id name')
      .populate('userId','email')
      .exec()
      .then(docs => {
        res.status(200).json({
          count: docs.length,
          orders: docs.map(doc => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              user: doc.email,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + doc._id
              }
            };
          })
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  };

  exports.post_order= (req, res, next) => {
    User.findById(req.body.userId)
    .then(user=>{
      if(!user){
        return res.status(404).json({
          message: "User not found"
        });
      }
      Product.findById(req.body.productId)
      .then(product => {
        if (!product) {
          return res.status(404).json({
            message: "Product not found"
          });
        }
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId,
          userId: req.body.userId
        });
        return order.save();
      })
      .then(result => {
        console.log(result);   
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
            userId: result.userId
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
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

  exports.order_get_by_id= (req, res, next) => {
    Order.findById(req.params.orderId).select('id product quantity')
    .populate('product','id name price')
    .populate('userId','email')
      .exec()
      .then(order => {
        if (!order) {
          return res.status(404).json({
            message: "Order not found"
          });
        }
        res.status(200).json({
          order: order,
          total:order.product.price*order.quantity,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders"
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  };

  exports.delete_order= (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Order deleted",
          request: {
            type: "POST",
            url: "http://localhost:3000/orders",
            body: { productId: "ID", quantity: "Number" }
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  };