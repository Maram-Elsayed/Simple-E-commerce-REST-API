const Order = require("../models/order");
const Product = require("../models/product");
const OrderProduct=require("../models/products_in_order");
const mongoose = require("mongoose");


exports.display_order=(req, res) => {
  OrderProduct.aggregate([{$match:{orderId: req.order._id}},
    { $group:{_id: '$orderId',totalAmount: { $sum:  "$total_price"  }}}])
  .exec()
  .then(result=>{
    console.log(result[0])
  OrderProduct.find({orderId: req.order._id})
  .populate('productId','name price')
  .exec()
  .then(docs=>{
    const response={
      count: docs.length,
      orderId:req.order._id,
      products:  docs.map(doc=>{
        return{
        product:doc.productId,
        quantity: doc.quantity,
        price: doc.total_price,
        
        }
       
      })
    }
  return res.status(200).json({response, total: result[0].totalAmount});
  });
})
};

exports.orders_get_all= (req, res, next) => {
    Order.find()
      .exec()
      .then(docs => {
        res.status(200).json({
          count: docs.length,
          orders: docs.map(doc => {
            return {
              OrderId: doc._id,
              request: {
                type: "GET",
                View_order_details: "http://localhost:3000/orders/" + doc._id
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
 
  exports.order_get_by_id= (req, res, next) => {
    Order.findById(req.params.orderId)
      .exec()
      .then(order => {
        if (!order) {
          return res.status(404).json({
            message: "Order not found"
          });
        }
        req.order=order;
        next();
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