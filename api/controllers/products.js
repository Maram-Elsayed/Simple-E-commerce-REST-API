const mongoose = require("mongoose");
const multer=require('multer');



const Product = require("../models/product");

exports.get_all_products=(req,res,next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs=>{
      const response={
        count: docs.length,
        products: docs.map(doc=>{
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
    //  if(docs.length>0){
      res.status(200).json(response);
    /*  }else{
       res.status(200).json({message: 'No Enties Found'});
      }*/
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error:err});
    })
 };

 exports.add_product= (req, res, next) => {
 
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    });
    product
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Product created successfully",
          createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
            type: 'GET',
            url: 'http://localhost:3000/products/'+result._id
             }          
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

  exports.edit_product= (req,res,next)=>{
    const id=req.params.productId;
    const updateOps={};
    for(const ops of req.body){
      updateOps[ops.propName]=ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result=>{
      console.log(result);
      res.status(200).json({message: 'Product updated successfully'});
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({error:err});
    });
  };

  exports.get_product=(req,res,next)=>{
    const id=req.params.productId;
    Product.findById(id)
   .select('name price _id productImage')
    .exec()
    .then(doc =>{
      console.log(doc);
      if(doc){
        res.status(200).json(doc);
      } else{
        res.status(404).json({message: 'Product Not Found'});
      }
     
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error:err})
    });
    
};

exports.delete_product=(req,res,next)=>{
    const id=req.params.productId;  
    Product.remove({_id: id}).exec()
    .then(result=>{
      res.status(200).json({message: 'Product deleted successfully'});
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({error:err})
  
    });
      
  };