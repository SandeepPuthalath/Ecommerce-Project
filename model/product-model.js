const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    product_name : String,
    product_category : String,
    product_price : Number,
    product_quantity : String,
    product_description : String
     
})

module.exports = mongoose.model('product',productSchema);