const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId

const userInfoSchema = new mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    ownerId : ObjectId,
    fname : String,
    lname : String,
    email : String,
    tel : Number,
    address : String,
    dob : String,
    userImage : String
})

module.exports = mongoose.model('userInfo',userInfoSchema);