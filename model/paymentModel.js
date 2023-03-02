var objectId = require('mongodb').ObjectId
// user payment details
const paymentShema = new mongoose.Schema({
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