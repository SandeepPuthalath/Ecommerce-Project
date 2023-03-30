import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    product_name:{ 
        type:String,
        require: true,
    },
    product_category: {
        type:String,
        require: true,
        ref:'categories'
    },
    product_price:{ 
        type:Number,
        require: true,
    },
    product_quantity:{ 
        type:Number,
        require: true,
    },
    product_description:{ 
        type:String,
    },
    product_status: {
        type: Boolean,
        default: true
    },
    product_images: Array

})

const Product = model('product', productSchema);
export default Product;