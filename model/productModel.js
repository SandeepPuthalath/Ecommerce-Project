const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    product_name : String,
    product_category : String,
    product_price : Number,
    product_quantity : Number,
    product_description : String,
    product_status : Boolean
     
})

module.exports = mongoose.model('product',productSchema);