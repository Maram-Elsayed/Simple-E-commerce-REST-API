const Cart = require("../models/shopping_carts");
const User = require("../models/user");
const Product = require("../models/product");
const CartProduct=require("../models/products_in_cart");
const mongoose = require("mongoose");

exports.create_cart=(req, res, next)=>{
  const cart=new Cart({
    _id: new mongoose.Types.ObjectId(),
    userId: req.userData._id
});
console.log({message: "userId= "+req.userData._id})
cart
.save()
res.status(201).json({
  message: "User created"
});
};

 
function display_cart_products(req,res,cart){
  CartProduct.find({cartId:cart._id})
  .populate('productId','name')
  .exec()
  .then(docs=>{
    if(docs.length<1){
      return res.status(200).json({message: "Shopping Cart is Empty"})
    }
    const response={
      products: docs.map(doc=>{
        return{
        product:doc.productId,
        quantity: doc.quantity
        }
      })
    }
  return res.status(200).json({response})
  })
    

};
exports.get_cart=(req, res, next) => {
  Cart.findOne({userId:req.userData.userId})
  .exec()
  .then(cart=>{  
     return display_cart_products(req,res,cart); 
   })
   .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    
};

exports.add_product_to_cart=(req, res, next) => {
  Cart.findOne({userId:req.userData.userId})
  .exec()
  .then(cart=>{
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
    CartProduct.findOne({productId:req.body.productId, cartId: cart._id})
    .exec()
    .then(result=>{
      if(result){
        if(result.quantity+1>product.quantity){
          return res.status(409).json({
            message: "Requested Quantity is Unavailabe"
          });
        }
        CartProduct.update({_id:result._id}, {quantity : result.quantity+1})
        .exec()
        .then(result=>{
       console.log(result);
          return display_cart_products(req,res,cart._id);      
        })
      }
      else{
        const cartproduct=new CartProduct({
          _id: new mongoose.Types.ObjectId(),
          productId: req.body.productId,
          cartId: cart._id
        })
    cartproduct
    .save()
    .then(result=>{
      return display_cart_products(req,res,cart._id);          
    })
      .catch(err=>{
        res.status(200).json({error: err});
      });
      }
    })
  })
  .catch(err=>{
    console.log(err);
    res.status(200).json({error: err});
  });
})
};

exports.remove_product_from_cart=(req, res, next) => {
  Cart.findOne({ userId: req.userData.userId })
  .exec()
  .then(cart => {
      CartProduct.remove({cartId:cart._id, productId:req.body.productId})
      .exec()
      .then(result=>{
        return display_cart_products(req,res,cart);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.delete_cart=(req, res, next) => {
  Cart.remove({ userId: req.params.userId })
  .exec()
  .then(result => {
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
  Cart.findOne({userId:req.userData.userId})
  .exec()
  .then(cart=>{
  Product.findOne({_id:req.params.productId})
  .exec()
  .then(product=>{
    if(!product){
      return res.status(409).json({
        message: "Invalid product id"
      });
    }    
    CartProduct.findOne({productId:req.params.productId, cartId: cart._id})
    .exec()
    .then(result=>{
      if(result){
        if(product.quantity<req.body.quantity){
          return res.status(409).json({
            message: "Requested Quantity is Unavailabe"
          });
        }
        console.log(result);
        CartProduct.updateOne({_id:result._id}, {quantity : req.body.quantity})
        .exec()
        .then(result1=>{
       console.log(result1);
          return display_cart_products(req,res,cart._id);      
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
})
};
