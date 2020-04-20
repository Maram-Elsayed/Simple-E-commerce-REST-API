const Product = require("../models/product");
const Category = require("../models/category");
const CategoryProduct=require("../models/products_in_category");
const mongoose = require("mongoose");


exports.check_validation=(req, res, next)=>{
    if(!req.body.parentId){
        req.parentId=null;
        next();}
    Category.findOne({_id:req.body.parentId})
    .exec()
    .then(result=>{
        if(!result){
          return res.status(404).json({error: 'Parent category not found'});
      
        }
        else{
          console.log(result);
          req.parentId=req.body.parentId;
          next();
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
};

exports.getCategory=(req, res, next)=>{
    Category.find({_id:req.params.categoryId})
    .exec()
    .then(category=>{
        if(!category){
            return res.status(404).json({error: "Category not found"})
        }
        req.category=category;
        next();
    }

    )
};

exports.create_category=(req, res, next)=>{
    const category=new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        parentId: req.parentId
    });
    console.log(category);
    category.save()
    res.status(201).json({
    message: "Category created",
    category
    });
};
    exports.add_product_to_category=(req, res, next)=>{
        Product.find({_id:req.body.productId})
        .exec()
        .then(product=>{
            if(!product){
                return res.status(409).json({
                  message: "Product not found"
                });
              }
        const categoryProduct=new CategoryProduct({
            _id: new mongoose.Types.ObjectId(),
            categorytId: req.body.categorytId,
            productId: req.body.productId
        });
        categoryProduct.save()
        console.log(categoryProduct);
       return res.status(201).json({
        message: "Product added to catgeory"
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(200).json({error: err});
      });

};

exports.get_category_products=(req,res,next)=>{
  CategoryProduct.find({categoryId:req.category._id})
  .populate('productId','name price')
  .exec()
  .then(docs=>{
    if(docs.length<1){
      return res.status(200).json({message: "No products found"})
    }
    req.category_products=docs;
    next();
  })
};

exports.display_category_products=(req,res)=>{
    const response={
      category: req.category.name,
      products: req.category_products.map(doc => {
        return{
        product:doc.productId,
        quantity: doc.price,
        }
      })
    }
  return res.status(200).json({response})
};


exports.view_all_categories=(req, res, next)=>{
  Category.find()
  .exec()
  .then(docs=>{
    const response={
    catgeories: docs.map(doc=>{
      return{
        id:doc._id,
        name:doc.name
        }
      })
    }  
  return res.status(200).json({response})
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.view_subcategories=(req, res, next)=>{
  Category.find({parentId:req.params.categoryId})
  .populate('parentId','name')
  .exec()
  .then(docs=>{
    const response={
    catgeory: docs.parentId,
    catgeories: docs.map(doc=>{
      return{
        id:doc._id,
        name:doc.name
        }
      })
    }  
  return res.status(200).json({response})
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.delete_category=(req, res, next) => {
  Category.remove({ userId: req.params.categoryId })
  .exec()
  .then(result => {
    CategoryProduct.remove({categoryId:req.params.categoryId }).exec()
    res.status(200).json({
      message: "Category deleted"
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};