const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    category_name : String,
    category_view : Boolean
})

module.exports = mongoose.model('category', categorySchema);

