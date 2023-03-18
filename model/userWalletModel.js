const { default: mongoose } = require('mongoose');
const objectId = require('mongodb').ObjectId;

const walletScheama = new mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    ownerId : objectId,
    walletBalance : Number,
    transactions : Array

});

module.exports = mongoose.model('wallet', walletScheama);

