const userSchema = require('../model/userModel');
const bcrypt = require('bcrypt');
const twilio = require('../middleware/twillioOtpSending');
const { loginPost } = require('../controllers/userControllers');
const cartSchema = require('../model/cartModel');
const productSchema = require('../model/productModel');
const { response } = require('../app');
const orderSchema = require('../model/orderModel');
var objectId = require('mongodb').ObjectId

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {

            let check = await userSchema.findOne({ email: userData.email })
            if (check) {
                reject({ exists: true })
            }
            else {
                userData.password = await bcrypt.hash(userData.password, 10);
                let user = new userSchema({
                    name: userData.name,
                    mobile: userData.mobile,
                    email: userData.email,
                    access: true,
                    password: userData.password,

                })
                await user.save()
                resolve(user);
            }
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await userSchema.findOne({ email: userData.email })
            let response = {};
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('success');
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    }
                    else {
                        console.log('login failed');
                        reject({ status: false })
                    }
                })
            }
            else {
                console.log('login failed');
                reject({ status: false });
            }
        })
    },
    checkForUser: (mobileNo) => {
        return new Promise(async (resolve, reject) => {
            let user = await userSchema.findOne({ mobile: mobileNo });
            if (user) {
                resolve(user);
            }
            else {
                reject({ status: ' there is no such user' });
            }

        })
    },
    // helper function to add product to user car

    addToUserCart: (userId, productId) => {
        let productObj = {
            item: objectId(productId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await cartSchema.findOne({ user: objectId(userId) });

            if (userCart) {
                let prodExist = userCart.product.findIndex(product => product.item == productId);

                if (prodExist != -1) {
                    cartSchema.updateOne({ user: objectId(userId), "product.item": objectId(productId) }, { $inc: { 'product.$.quantity': 1 } }, { upsert: true }).then((response) => {
                        resolve()
                    })
                }
                else {
                    cartSchema.updateOne({ user: objectId(userId) }, { $push: { product: productObj } }).then((response) => {

                        resolve();
                    })
                }
            }
            else {
                let cart = new cartSchema({
                    user: objectId(userId),
                    product: productObj
                })
                await cart.save();
                resolve()
            }

        })
    },
    // getting user cart...
    getUserCart: (userId) => {

        return new Promise(async (resolve, reject) => {
            
            let cartItems = await cartSchema.aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: "$product.quantity"
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                }, {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ])
            cartItems = JSON.parse(JSON.stringify(cartItems));
            resolve(cartItems);
        })
    },
    // changing increasing and decreasing product quantity

    changeCartQuantity: (details) => {

        details.count = parseInt(details.count);
        details.quantity = parseInt(details.quantity);

        return new Promise((resolve, reject) => {

            if (details.count == -1 && details.quantity == 1) {

                cartSchema.updateOne({ _id: objectId(details.cart) },
                    {
                        $pull: { product: { item: objectId(details.product) } }
                    }
                ).then((response) => {
                    resolve({ removeProduct: true });
                })
            }
            else {
                cartSchema.updateOne({ _id: objectId(details.cart), "product.item": objectId(details.product) },
                    {
                        $inc:
                        {
                            'product.$.quantity': details.count
                        }
                    })
                    .then((response) => {
                        resolve({ status: true })
                    })
            }

        })
    },
    removeCartProduct: (details) => {
        return new Promise((resolve, reject) => {
            cartSchema.updateOne({ _id: objectId(details.cart) },
                {
                    $pull: { product: { item: objectId(details.product) } }
                }
            ).then((response) => {
                resolve({ removeProduct: true });
            })
        })

    },
    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            
            let total = await cartSchema.aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: "$product.quantity"
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                }, {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                }, {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', '$product.product_price'] } }
                    }
                }
            ]);


            resolve(total[0].total);


        })
    },
    placingOrder: (order, products, totalPrice) => {
        return new Promise(async (resolve, reject) => {
            let status = order.payment_option == 'cod' ? 'placed' : 'pending';
            let orderDate = new Date();
            let fullfildate = orderDate.setDate(orderDate.getDate() + 3);
            let orderDetails = new orderSchema({
                dateOfOrder: orderDate,
                dateOfFullfilment: fullfildate,
                userId: order.userId,
                address: {
                    full_name: order.fname,
                    last_name: order.lname,
                    country: order.country,
                    address_line_1: order.billing_address,
                    address_line_2: order.billing_address2,
                    city: order.city,
                    state: order.state,
                    pin_code: order.zipcode,
                    phone_number: order.phone
                },
                totalAmount: totalPrice,
                paymentMethod: order.payment_option,
                status: status
            })
            await orderDetails.save();
            resolve(orderDetails);

        })
    },
    getCartProductList: (userId) => {
        return new Promise(async (resolve, reject) => {
            let products = await cartSchema.findOne({ user: objectId(userId) });
            resolve(products);
        })
    },
    removeAllProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            await cartSchema.deleteOne({ user: objectId(userId) });
            resolve();
        })

    },
    orderDetails :(userId) =>{
        return new Promise ((resolve, reject) =>{
            orderSchema.find({$and : [{userId : objectId(userId)},{status: { $not  : {$regex : "cancelled"}}}]}).then((response) =>{
                resolve(response);
            })
        })
    },
    removeOrder :(orderId) =>{
        return new Promise((resolve, reject) =>{
           orderSchema.updateOne({_id : objectId(orderId)}, {$set :{status : 'cancelled'}}).then((response) =>{
            resolve(true)
           })
        })
    },
    orderHistory :(userId) =>{
        return new Promise ((resolve, reject) =>{
            orderSchema.find({$and : [{userId : objectId(userId)},{status:"cancelled"}]}).then((response) =>{
                console.log(response);
                resolve(response);
            })
        })
    }
}
