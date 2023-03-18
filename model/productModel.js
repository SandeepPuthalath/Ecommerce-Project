const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    product_name: String,
    product_category: String,
    product_price: Number,
    product_quantity: Number,
    product_description: String,
    product_status: {
        type: Boolean,
        default: true
    },
    product_images: Array

})

module.exports = mongoose.model('product', productSchema);