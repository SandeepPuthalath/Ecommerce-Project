const productSchema = require('../model/productModel');
const objectId = require('mongodb').ObjectId

module.exports = {
    pageProductLoading: () => {
        return new Promise(async (resolve, reject) => {
            let product = await productSchema.find();
            resolve(product);
        })
    },
    productView :(productId) =>{
        return new Promise( async (resolve, reject) =>{
            let product =  await productSchema.findOne({_id : objectId(productId)});
            resolve(product);
        })
    }
}

