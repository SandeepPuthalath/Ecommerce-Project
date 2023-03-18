const userSchema = require('../model/userModel').default;
const bcrypt = require('bcrypt');
const cartSchema = require('../model/cartModel');
const orderSchema = require('../model/orderModel');
const addressSchema = require('../model/addressModel')
const wishlistSchema = require('../model/wishlistModel');
const productSchema = require('../model/productModel');
const userInfoSchema = require('../model/userInfoModel');
const walletSchema = require('../model/userWalletModel');
const objectId = require('mongodb').ObjectId

function orderDate() {
    const date = new Date(); // create a new Date object with the current date and time

    // format the date and time in a string
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    return formattedDate
    
}

function deliveryDate() {
    const date = new Date(); // create a new Date object with the current date and time

    // format the date and time in a string
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  
    return formattedDate;
    
}

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {

            let check = await userSchema.findOne({ $or: [{ email: userData.email }, { mobile: userData.mobile }] })
            if (check) {
                reject()
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
                        resolve(response)
                    })
                }
                else {
                    cartSchema.updateOne({ user: objectId(userId) }, { $push: { product: productObj } }).then((response) => {

                        resolve(response);
                    })
                }
            }
            else {
                let cart = new cartSchema({
                    user: objectId(userId),
                    product: productObj
                })
                await cart.save();
                resolve(cart)
            }

        })
    },
    // adding product from wish list to cart
    wishlistToCart: (prodId, userId) => {
        let prodObj = {
            item: objectId(prodId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await cartSchema.findOne({ userId: objectId(userId) });

            if (userCart) {
                let prodExist = userCart.product.findIndex(product => product.item == prodId)
                if (prodExist != -1) {
                    cartSchema.updateOne({ user: objectId(userId), "product.item": objectId(prodId) }, { $inc: { 'product.$.quantity': 1 } }, { upsert: true }).then((response) => {

                        resolve({ status: true })
                    })
                }
                else {
                    cartSchema.updateOne({ user: objectId(userId) }, { $push: { product: prodObj } }).then((response) => {

                        resolve({ status: true });
                    })
                }

            }
            else {
                let cart = new cartSchema({
                    user: objectId(userId),
                    product: prodObj
                })
                await cart.save();
                resolve({ status: true })
            }
            await wishlistSchema.updateOne({ userId: objectId(userId) }, { $pull: { product: objectId(prodId) } })
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
            if (total.length == 1) {
                
                resolve(total[0].total)
            }
            else {
                total = 0;
                resolve(total);
            }
        })
    },
    placingOrder: (order, products, totalPrice) => {
        return new Promise(async (resolve, reject) => {
            let status = order.payment_option == 'cod' ? 'placed' : 'pending';
            let date = orderDate();
            let delivDate = deliveryDate();
            let address = await addressSchema.findOne({ _id: objectId(order.address) })
            let orderDetails = new orderSchema({
                dateOfOrder: date,
                dateOfFullfilment: delivDate,
                userId: order.userId,
                address: {
                    name: address.full_name,
                    phoneNumber: address.phone_number,
                    country: address.country,
                    address_line: address.address_line_1,
                    city: address.city,
                    state: address.state,
                    pin_code: address.zipcode,
                    phone_number: order.phone,
                },
                orderedItems : products.product,
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
            let products = await cartSchema.findOne({ user: objectId(userId) }).select('product');
            resolve(products);
        })
    },
    removeAllProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            await cartSchema.deleteOne({ user: objectId(userId) });
            resolve();
        })

    },
    orderDetails: (userId) => {
        return new Promise((resolve, reject) => {
            orderSchema.find({ $and: [{ userId: objectId(userId) }, { status: { $not: { $regex: "cancelled" } } }] }).then((response) => {
                resolve(response);
            })
        })
    },
    removeOrder: (orderId) => {
        return new Promise((resolve, reject) => {
            orderSchema.findOneAndUpdate({ _id: objectId(orderId) }, { $set: { status: 'cancelled' } }).then( async(res) => {
                console.log(res);
                if((res.paymentMethod === "paypal" || res.paymentMethod === "razorpay") && res.status === "placed"){
                    let transaction = {
                        transactionDate : Date.now(),
                        description : "order cancellation refund" ,
                        amount : res.totalAmount
                    }
                    let wallet = await walletSchema.findOne({ownerId : objectId(res.userId)});
                    if(wallet){
                        let newWalletBalance = res.totalAmount + wallet.walletBalance;
                        await walletSchema.updateOne(
                            {
                                ownerId : objectId(res.userId)
                            },
                            {
                                $set : {
                                    walletBalance : newWalletBalance
                                },
                                $push : {
                                    transactions : transaction
                                }
                            }
                        )
                        resolve(true);
                    }
                    else{
                        let wallet = new walletSchema({
                            ownerId : objectId(res.userId),
                            walletBalance : res.totalAmount,
                            transactions : transaction
                        })
                        await wallet.save();

                        resolve(true)
                    }
                }
                
            })
        })
    },
    orderHistory: (userId) => {
        return new Promise((resolve, reject) => {
            orderSchema.find({ $and: [{ userId: objectId(userId) }, { status: "cancelled" }] }).then((response) => {
                resolve(response);
            })
        })
    },
    // adding address to database
    addTheAddress: (address) => {
        console.log(address);
        return new Promise(async (resolve, reject) => {
            let userAddress = new addressSchema({
                full_name: address.fname,
                phone_number: address.phone,
                email_id: address.email,
                address_line_1: address.address,
                city: address.city,
                state: address.state,
                country: address.country,
                pin_code: address.zipcode,
                userId: address.userId

            })

            await userAddress.save();
            resolve(userAddress);
        });
    },
    //getting and adding wishlist items
    getUserWishlist: (userId) => {
        return new Promise(async (resolve, reject) => {
            let wishlist = await wishlistSchema.aggregate([
                {
                    $match: { userId: objectId(userId) },

                },
                {
                    $lookup: {
                        from: 'products',
                        let: {
                            prodList: '$product'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$prodList']
                                    }
                                }
                            }
                        ],
                        as: 'wishlist'
                    }
                }


            ]);
            console.log(wishlist);
            if (wishlist.length != 0) {
                resolve(wishlist[0].wishlist);
            }

        })
    },
    addItemToWishlist: (details) => {
        return new Promise(async (resolve, reject) => {
            let wishlist = await wishlistSchema.findOne({ userId: objectId(details.userId) })
            if (wishlist) {
                wishlistSchema.updateOne({
                    userId: objectId(details.userId)
                },
                    {
                        $addToSet: {
                            product: objectId(details.prodId)
                        }
                    }).then((response) => {
                        resolve(response)
                    })
            }
            else {
                let userWishlist = new wishlistSchema({
                    userId: objectId(details.userId),
                    product: objectId(details.prodId)
                })

                await userWishlist.save();
                resolve(userWishlist);
            }
        })
    },
    // changeing stock quantity of products
    changeStockQuantity: (prodId) => {
        return new Promise(async (resolve, reject) => {
            let product = await productSchema.findOne({ _id: objectId(prodId) })
            if (product.product_quantity <= 0) {
                reject()
            } else {
                await productSchema.updateOne({ _id: objectId(prodId) }, { $inc: { product_quantity: -1 } });
                resolve(true)
            }

        })
    },

    //deleting use address

    deleteAddress: (addressId) => {
        return new Promise((res, rej) => {
            addressSchema.deleteOne({ _id: objectId(addressId) }).then((status) => {
                res(status);
            })
        })
    },

    getUserInfo: (userId) => {
        return new Promise((resolve, reject) => {
            userInfoSchema.findOne({ownerId : objectId(userId) }).then((userInfo) => {
                resolve(userInfo)
            })
        })
    }
    ,

    userInfoUpdating: (userDetails, userId, image) => {
        return new Promise(async (resolve, reject) => {
            let userInfoExist = await userInfoSchema.exists({ ownerId: objectId(userId) });
            if (userInfoExist != null) {
                if(image){
                    userInfoSchema.findOneAndUpdate({ ownerId: objectId(userId) }, {
                        $set: {
                            fname: userDetails.fname,
                            lname: userDetails.lname,
                            email: userDetails.email,
                            tel: userDetails.tel,
                            address: userDetails.address,
                            dob: userDetails.dob,
                            userImage : image.path,
                        },
                        },
                        { new: true, upsert: true } // options
                    ).then((response) =>{
                        resolve(response)
                    })
                }
                else{
                    userInfoSchema.findOneAndUpdate({ ownerId: objectId(userId) }, {
                        $set: {
                            fname: userDetails.fname,
                            lname: userDetails.lname,
                            email: userDetails.email,
                            tel: userDetails.tel,
                            address: userDetails.address,
                            dob: userDetails.dob,
                        },
                        },
                        { new: true, upsert: true } // options
                    ).then((response) =>{
                        resolve(response)
                    })
                }
               

            } else  {
                let userInfo = new userInfoSchema({
                    ownerId: objectId(userId),
                    fname: userDetails.fname,
                    lname: userDetails.lname,
                    email: userDetails.email,
                    tel: userDetails.tel,
                    address: userDetails.address,
                    dob: userDetails.dob,
                    userImage: image.path
                })

                await userInfo.save();

                resolve({ satus: true })
            }
        })
    },

    // verifying the payment

    verifyingPayment : (details) =>{
        return new Promise ((resolve, reject) =>{
            const crypto = require('crypto');
            let hmac = crypto.createHmac('sha256', 'VTe4tcPjxXRWHLbvpysPjnMJ');
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
            hmac = hmac.digest('hex')
            if(hmac == details[ 'payment[razorpay_signature]']){
                resolve();
            }
            else{
                reject();
            }
        })
    },
    changePaymentStatus : (orderId) =>{
        return new Promise((resolve, reject) =>{
            orderSchema.updateOne({_id :objectId(orderId)}, {$set:{status : 'placed'}}).then(()=>{
                resolve()
            })
        })
      
    },

    getUserWallet : (userId) =>{
        return new Promise (async (resolve, reject) =>{
            const wallet =  await walletSchema.findOne({ownerId : objectId(userId)})
            if(wallet){
                resolve(wallet.walletBalance);
            }
            else{
                resolve(0);
            }

         })
    }

}

