const mongoose = require('mongoose')


// user signup details
const userSchema = new mongoose.Schema({
    name : String,
    mobile : String,
    email : String,
    password : String,
    access : Boolean,
    address : Array, 
});

module.exports = mongoose.model('users',userSchema);



