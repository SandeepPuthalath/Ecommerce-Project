import mongoose, {Schema, model} from 'mongoose';

const productSchema = new Schema({
    name : {
        type : String,
        require : true,
    },
    description : {
        type : String,
    },
    price: {
        type : Number,
        require : true
    },
    quanity : {
        type : Number,
        require : true
    },
    images : [{
        type : String,
        unique : true
    }]
    
})

const Product = mongoose.model('Product', productSchema);

export default Product;

//this has been not used