const { default: mongoose } = require('mongoose');

var objectId = require('mongodb').ObjectId

// user cart details...
const cartSchema = new mongoose.Schema({
    user : objectId,
    product : Array,
    totalAmount : Number,
    paymentMethod : String,
    status : String
})

module.exports = mongoose.model('cart', cartSchema);
