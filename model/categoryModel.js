const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    category_name : String,
    category_view : Boolean
})

module.exports = mongoose.model('category', categorySchema);

