import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
    name: {
         type: String, 
         required: true, 
         unique: true },
    description: { 
        type: String, 
        required: true },
    status: {
        type:Boolean,
        default: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Category =  model('category', categorySchema);

export default Category;
