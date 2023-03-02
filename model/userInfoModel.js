const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId

const userInfoSchema = new mongoose.Schema({
    ownerId : ObjectId,
    fname : String,
    lname : String,
    email : String,
    tel : Number,
    address : String,
    dob : String
})

module.exports = mongoose.model('userInfo',userInfoSchema);