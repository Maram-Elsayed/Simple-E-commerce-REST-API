const Cart = require("../models/shopping_carts");
const User = require("../models/user");
const Product = require("../models/product");
const CartProduct=require("../models/products_in_cart");
const mongoose = require("mongoose");

function create_cart (req){
  const cart=new Cart({
    _id: new mongoose.Types.ObjectId(),
    userId: req.userData.userId
});
cart
.save()
return cart;
};

 
function display_cart_products(req,res,cart){
  CartProduct.find({cartId:cart._id})
  .populate('productId','name')
  .exec()
  .then(docs=>{
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
 
   if(!cart){
      cart= create_cart(req, res);
      return;
    }  
    
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
  if(!cart){
    cart=create_cart(req,res);
  }
  Product.findOne({_id:req.body.productId})
  .exec()
  .then(product=>{
    if(!product){
      return res.status(409).json({
        message: "Invalid product id"
      });
    }
    CartProduct.findOne({productId:req.body.productId, cartId: cart._id})
    .exec()
    .then(result=>{
      if(result){
        CartProduct.update({productId:req.body.productId, cartId: cart._id}, {quantity : result.quantity+1})
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
      return res.status(200).json({result});        
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

exports.delete_cart=(req, res, next) => {
  Cart.remove({ _id: req.params.cartId })
  .exec()
  .then(result => {
    res.status(200).json({
      message: "Cart deleted"
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
}
