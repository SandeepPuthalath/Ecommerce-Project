import { default as mongoose } from 'mongoose';
import { ObjectId as objectId } from 'mongodb';
// user address details
const addressSchema = new mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    full_name : String,
    phone_number : Number,
    email_id : String,
    address_line_1 : String,
    city : String,
    state : String,
    country : String,
    pin_code : Number,
    userId : objectId
});

const Address =  mongoose.model('address', addressSchema);
export default Address;