const mongoose = require("mongoose");

const categorytSchema= mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    parentId: {type: String, ref: 'Category'}
   
});

module.exports=mongoose.model('Category', categorytSchema);