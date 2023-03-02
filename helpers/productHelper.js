const productSchema = require('../model/productModel');
const bannerSchema = require('../model/bannerModel')
const objectId = require('mongodb').ObjectId

module.exports = {
    pageProductLoading: () => {
        return new Promise(async (resolve, reject) => {
            let product = await productSchema.find();
            resolve(product);
        })
    },
    bannerLoading : ()=>{
        return new Promise ( async(resolve, reject) =>{
            let banners = await bannerSchema.find();
            resolve(banners);
        })
    },
    productView :(productId) =>{
        return new Promise( async (resolve, reject) =>{
            let product =  await productSchema.findOne({_id : objectId(productId)});
            resolve(product);
        })
    }
}

