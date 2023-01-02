const userSchema = require('../model/user-model');
const productSchema = require('../model/product-model');
const categorySchema = require('../model/category-model')
var objectId = require('mongodb').ObjectId

let admin = {
    name : 'Admin Sandeeep',
    email : 'admin@gmail.com',
    password : 'admin'
}
module.exports = {

    getAllUserDetails: () => {
        return new Promise(async (resolve, reject) => {
            let userData = await userSchema.find();
            if(userData){
                resolve(userData);
            }
            else{
                reject({status : false})
            }

        })

    },
    blockUser :(userId) =>{
        return new Promise((resolve, reject)=>{
            userSchema.updateOne({_id : userId},{$set :{access : false}}).then(()=>{
                resolve({status : true})
            })
        })
    },
    unblockUser :(userId) =>{
        return new Promise((resolve, reject) =>{
            userSchema.updateOne({_id : userId},{$set : {access : true}}).then(()=>{
                resolve({status : true});
            })
        })
    },
    addProduct :(productData) =>{
        return new Promise( async (resolve, reject)=>{
            let product = new productSchema({
                product_name : productData.name,
                product_category : productData.category,
                product_price : productData.price,
                product_description : productData.description,
                product_quantity : productData.quantity
            })
            await product.save()
            resolve(product._id)
        })
    },
    getAllProducts :()=>{
        return new Promise(async (resolve, reject) => {
            let products = await productSchema.find();
            resolve(products);
        })
    },
    getProductDetails :(productId) =>{
        return new Promise( async (resolve, reject) =>{
            let product = await productSchema.find({_id : objectId(productId)});
            resolve(product);
        })
    },
    updateProduct :(product,productId)=>{
        return new Promise((resolve, reject)=>{
            productSchema.updateOne({_id : objectId(productId)},{$set :{ 
                product_name : product.name,
                product_category : product.category,
                product_price : product.price,
                product_description : product.description,
                product_quantity : product.quantity
            }}).then((response)=>{
                resolve()
            })

        })
    },
    categoryListing : (categoryData) =>{
        console.log(categoryData);
        return new Promise ( async (resolve, reject) =>{
           let category = await new categorySchema({
            category_name : categoryData.category,
            category_view : true
           })
           await category.save();
           resolve(category._id);
        })
    },
    getAllCategory :() =>{
        return new Promise( async (resolve, reject) =>{
            let category = await categorySchema.find();
            resolve(category);
        })
    },
    list_category :(categoryId) =>{
        return new Promise((resolve, reject) =>{
            categorySchema.updateOne({_id : objectId(categoryId)},{$set : {category_view : true}}).then(() =>{
                resolve()
            })
        })
    },
    unlist_category :(categoryId) =>{
        console.log(categoryId);
        return new Promise((resolve, reject) =>{
            categorySchema.updateOne({_id : objectId(categoryId)},{$set : {category_view : false}}).then(()=>{
                resolve();
            })
        })
    },
    delete_product :(productId) =>{
        console.log(productId);
        return new Promise((resolve, reject) =>{
            productSchema.deleteOne({_id : objectId(productId)}).then(() =>{
                resolve();
            }).catch(()=>{
                reject();
            })
        })
    },
    admin_login :(loginDetails) =>{
        return new Promise((resolve, reject) =>{
            if(admin.email === loginDetails.email && admin.password === loginDetails.password){
                console.log('success');
                resolve(admin);
            }
            else{
                console.log('failed to login');
                reject({status : false});
            }
        })
    },
}