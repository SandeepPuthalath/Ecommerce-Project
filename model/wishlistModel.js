import { default as mongoose } from 'mongoose';
import { ObjectId as objectId } from 'mongodb';

const wishlistSchema = new mongoose.Schema({
    userId : objectId,
    product : Array
})

const Wishlist = mongoose.model('wishlist', wishlistSchema);

export default Wishlist;