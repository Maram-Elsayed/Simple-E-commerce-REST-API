const mongoose = require('mongoose');
mongoose.set('debug', true);

const product_In_CartSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
   quantity: { type: Number, default: 1 },
   total_price:{type: Number},
   cartId: {type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true }
});

module.exports = mongoose.model('CartProducts', product_In_CartSchema);