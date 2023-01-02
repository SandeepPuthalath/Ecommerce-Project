const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : String,
    mobile : String,
    email : String,
    password : String,
    access : Boolean,
    address : Object
     
})

module.exports = mongoose.model('users',userSchema);