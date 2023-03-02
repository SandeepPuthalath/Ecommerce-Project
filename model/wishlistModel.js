const { default: mongoose } = require('mongoose');
const objectId = require('mongodb').ObjectId;

const wishlistSchema = new mongoose.Schema({
    userId : objectId,
    product : Array
})


module.exports = mongoose.model('wishlist', wishlistSchema);