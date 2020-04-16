const Cart = require("../models/shopping_carts");
const User = require("../models/user");
const Product = require("../models/product");
const CartProduct=require("../models/products_in_cart");
const Order = require("../models/order");
const OrderProduct=require("../models/products_in_order");
const mongoose = require("mongoose");


exports.create_cart=(req, res, next)=>{
  const cart=new Cart({
    _id: new mongoose.Types.ObjectId(),
    userId: req.userData._id
});
cart
.save()
res.status(201).json({
  message: "User created"
});
};

exports.find_cart=(req, res, next)=>{
  Cart.findOne({userId:req.userData.userId})
  .exec()
  .then(cart=>{
    req.cart=cart;
    next();
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.get_cart_products=(req, res, next)=>{
  CartProduct.find({cartId:req.cart._id})
  .populate('productId','name price')
  .exec()
  .then(docs=>{
    if(docs.length<1){
      return res.status(200).json({message: "Shopping Cart is Empty"})
    }
    req.cart_products=docs;
    next();
  })
    
};
 
exports.display_cart_products=(req,res)=>{
    const response={
      products: req.cart_products.map(doc => {
        return{
        product:doc.productId,
        quantity: doc.quantity,
        total_price:doc.total_price
        }
      })
    }
  return res.status(200).json({response})
};

exports.add_product_to_cart=(req, res, next) => {
  Product.findOne({_id:req.body.productId})
  .exec()
  .then(product=>{
    if(!product){
      return res.status(409).json({
        message: "Invalid product id"
      });
    }
    else if(product.quantity<1){
      return res.status(409).json({
        message: "Product Out Of Stock"
      });
    }
    CartProduct.findOne({productId:req.body.productId, cartId: req.cart._id})
    .exec()
    .then(result=>{
      if(result){
        if(result.quantity+1>product.quantity){
          return res.status(409).json({
            message: "Requested Quantity is Unavailabe"
          });
        }
        CartProduct.update({_id:result._id}, {quantity : result.quantity+1, total_price: (result.quantity+1)*product.price})
        .exec()
        next();
      }
      else{
        const cartproduct=new CartProduct({
          _id: new mongoose.Types.ObjectId(),
          productId: req.body.productId,
          cartId: req.cart._id,
          total_price: product.price
        })
    cartproduct.save()
    next();
    
      }
      
     
    })
    
  })
 .catch(err=>{
    console.log(err);
    res.status(200).json({error: err});
  });
};

exports.remove_product_from_cart=(req, res, next) => {
  console.log(req.body.productId);
  CartProduct.remove({cartId:req.cart._id, productId:req.body.productId})
  .exec()
 
  next();
};

exports.delete_cart=(req, res, next) => {
  Cart.remove({ userId: req.params.userId })
  .exec()
  .then(result => {
    CartProduct.remove({cartId: req.params.userId}).exec()
    res.status(200).json({
      message: "Cart and user deleted"
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.edit_product_quantity=(req, res, next) => {
  Product.findOne({_id:req.params.productId})
  .exec()
  .then(product=>{
    if(!product){
      return res.status(409).json({
        message: "Invalid product id"
      });
    }    
    CartProduct.findOne({productId:req.params.productId, cartId: req.cart._id})
    .exec()
    .then(result=>{
      if(result){
        if(product.quantity<req.body.quantity){
          return res.status(409).json({
            message: "Requested Quantity is Unavailabe"
          });
        }
        console.log(result);
        CartProduct.updateOne({_id:result._id}, {quantity : req.body.quantity, total_price: req.body.quantity*product.price})
        .exec()
        .then(result1=>{
       console.log(result1);
       next();
        })
      }
      else{
        return res.status(409).json({message: "Product is not is bag"});
      }
    })
  })
  .catch(err=>{
    console.log(err);
    res.status(200).json({error: err});
  });
};

exports.checkout=(req, res, next) => {
  const order=new Order({
    _id: new mongoose.Types.ObjectId(),
    userId: req.userData.userId
  });
  
  order.save()
  .then(result=>{
    req.cart_products.map(doc => {
      Product.findOneAndUpdate({_id:doc.productId._id},{$inc: {quantity: -doc.quantity}})
      .exec()
      .then(item=>{
      const order_product=new OrderProduct({
        _id: new mongoose.Types.ObjectId(),
        productId: doc.productId._id,
        quantity: doc.quantity,
        total_price:doc.total_price,
        orderId: result._id
      })    
      order_product.save()

     // Product.updateOne({_id:doc.productId._id}, {quantity : product.quantity-doc.quantity}).exec()
      console.log(item.quantity)
    })
    .catch(err=>{
      console.log(err);
      return res.status(200).json({error: "product "+doc.productId+" not found"});
    });
   })
   return res.status(200).json(
     {message: "Checkout Completed successfully. View order details: ",
      request: {
      type: "GET",
      View_order_details: "http://localhost:3000/orders/" + result._id
    }
  })
  })
    .catch(err=>{
      console.log(err);
      res.status(200).json({error: err});
    });
};

