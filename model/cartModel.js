import { default as mongoose } from 'mongoose';

import { ObjectId as objectId } from 'mongodb';

// user cart details...
const cartSchema = new mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    user : objectId,
    product : Array,
    totalAmount : Number,
    status : String,
    coupon:{
        type: String,
        default: null
    },
    discount:{
        type: Number,
        default: 0
    },
    totalAmount:{
        type: Number,
        require: true,
    }
})

const Cart =  mongoose.model('cart', cartSchema);

export default Cart

