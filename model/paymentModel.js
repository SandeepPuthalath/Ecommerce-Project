var objectId = require('mongodb').ObjectId
// user payment details
const paymentShema = new mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    card :{
        holderName : String,
        cardCVV : String,
        expireDate : String,
        cardNo : String,
    },
    user : objectId,
    UPI : String
    
})

module.exports = mongoose.model('payments', paymentShema);