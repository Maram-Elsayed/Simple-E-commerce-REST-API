const mongoose = require("mongoose");

mongoose.set('debug', true);

const product_In_OrderSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
   quantity:  { type: Number},
   total_price:{type: Number},
   orderId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }
});

module.exports = mongoose.model('OrderProduct', product_In_OrderSchema);