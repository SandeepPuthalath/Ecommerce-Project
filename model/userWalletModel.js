import { default as mongoose } from 'mongoose';
import { ObjectId as objectId } from 'mongodb';

const walletScheama = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    ownerId: objectId,
    walletBalance: Number,
    transactions: Array

});

const Wallet = mongoose.model('wallet', walletScheama);

export default Wallet

