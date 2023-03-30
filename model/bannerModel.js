import { default as mongoose } from 'mongoose';


const bannerSchema = new mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    title1 : String,
    title2 : String,
    title3 : String,
    description: String,
    discount : Number,
    tagName: String,
    bannerImg : String

})

const Banner = mongoose.model('banner', bannerSchema);

export default Banner