const { default: mongoose } = require('mongoose');

var objectId = require('mongodb').ObjectId

// user order details
const orderSchema = new mongoose.Schema({
    createAt :{
        type: Date,
        default : Date.now()
    },
    dateOfOrder : String,
    dateOfFullfilment : String,
    userId : objectId,
    address : Object,
    orderedItems : Object,
    totalAmount : Number,
    paymentMethod : String,
    status : String

})

module.exports = mongoose.model('order', orderSchema);