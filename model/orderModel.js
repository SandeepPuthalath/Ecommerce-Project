import { default as mongoose } from 'mongoose';

import { ObjectId as objectId } from 'mongodb';

// user order details
const orderSchema = new mongoose.Schema({
    createAt: {
        type: Date,
        default: Date.now()
    },
    dateOfOrder: String,
    dateOfFullfilment: String,
    userId: objectId,
    address: Object,
    orderedItems: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number
        }
    ],
    coupon:{
        type: String,
        default: null
    },
    discount:{
        type: Number,
        require: true,
        default:0
    },
    total:{
        type:Number,
        require:true,
    },
    totalAmount: Number,
    paymentMethod: String,
    status: String

})

const Order = mongoose.model('order', orderSchema);

export default Order