const { default: mongoose } = require('mongoose');

var objectId = require('mongodb').ObjectId

// user order details
const orderSchema = new mongoose.Schema({
    dateOfOrder : Date,
    dateOfFullfilment : Date,
    userId : objectId,
    address : Object,
    totalAmount : Number,
    paymentMethod : String,
    status : String

})

module.exports = mongoose.model('order', orderSchema);