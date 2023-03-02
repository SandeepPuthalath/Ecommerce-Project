const { default: mongoose } = require('mongoose');
const objectId = require('mongodb').ObjectId

const bannerSchema = new mongoose.Schema({
    title1 : String,
    title2 : String,
    title3 : String,
    description: String,
    discount : Number,
    tagName: String
})


module.exports = mongoose.model('banner', bannerSchema);