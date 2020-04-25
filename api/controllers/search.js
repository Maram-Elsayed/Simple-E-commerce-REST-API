const Product = require("../models/product");
const Category = require("../models/category");
const CategoryProduct=require("../models/products_in_category");
const mongoose = require("mongoose");


exports.display_search_results=(req, res) => {
    const response={
        count: req.search_result.length,
        products: req.search_result.map(doc=>{
          return{
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/'+doc._id
            }
          }
        })
      }
      res.status(200).json(response);
};

exports.display_products_in_category_search=(req, res) => {
    const response={
        count: req.search_result.length,
        Product: req.search_result.map(doc=>{
          return{
            name: doc.product[0].name,
            price: doc.product[0].price,
            productImage: doc.product[0].productImage,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/'+doc._id
            }
          }
        })
      }
      res.status(200).json(response);
}

exports.search_product_in_category=(req, res,next) => {
    CategoryProduct.aggregate([{$match:{categoryId:req.category._id}},
        {
          $lookup:{
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as : "product"
      
          }
        }
        ,{$match:{ 'product.name': {$regex: '.*' + req.query.index + '.*'} }}
        ,{ $project: { "product.name": 1, "product.price": 1, "product.productImage": 1 } } 
        ])
    .exec()
    .then(docs=>{
      if(docs.length<1){
        return res.status(200).json({message: "No products found"})
      }
      //return res.status(200).json(docs.product);
      req.search_result=docs;
      next();
    })
};

exports.search_product=(req, res,next) => {;
    Product.find({name: { $regex: '.*' + req.query.index + '.*' }})
    .exec()
    .then(result=>{
        if(!result){
            return res.status(200).json({
                message: "No results found"
            });
        }
        req.search_result=result;
        next();

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    };