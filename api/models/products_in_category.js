const mongoose = require('mongoose');
mongoose.set('debug', true);

const product_In_CategorySchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   categorytId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
   productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'}
});

module.exports = mongoose.model('CategoryProducts', product_In_CategorySchema);