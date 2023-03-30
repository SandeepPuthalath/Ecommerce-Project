import mongoose from 'mongoose'
import Wishlist from '../../model/wishlistModel'
import Cart from '../../model/cartModel'
import Product from '../../model/productModel'



export const handleMoveToCart = async (req, res) => {
    const { id } = req.params
    const { user } = req.session
    const productObj = {
        item: mongoose.Types.ObjectId(id),
        quantity: 1
    }
    try {
        const product = await Product.findById(id)
        const cart = await Cart.findOne({ user: user._id }).exec();
        if (cart) {
            const productExist = cart.product.findIndex(product => product.item == id);
            if (productExist != -1) {
                await Cart.updateOne({ user: user._id, 'product.item': mongoose.Types.ObjectId(id) },
                    { $inc: { 'product.$.quantity': 1 } })
                Wishlist.findOneAndUpdate({ userId: user._id },
                    { $pull: { product: mongoose.Types.ObjectId(id) } },
                    { new: true },
                    (err, updatedDoc) => {
                        if (err) {
                            res.status(200).json({ error: true, message: 'Somthing went wrong' })
                        } else {
                            res.status(200).json({ error: false, message: 'Product has been moved to cart', wishlist: updatedDoc })
                        }
                    }
                )
            } else {
                await Cart.updateOne({ user: user._id },
                    { $push: { product: productObj } })
                Wishlist.findOneAndUpdate({ userId: user._id },
                    { $pull: { product: mongoose.Types.ObjectId(id) } },
                    { new: true },
                    (err, updatedDoc) => {
                        if (err) {
                            res.status(200).json({ error: true, message: 'Somthing went wrong' })
                        } else {
                            res.status(200).json({ error: false, message: 'Product has been moved to cart', wishlist: updatedDoc })
                        }
                    }
                )
            }
        } else {
            let newCart = Cart({
                user: user._id,
                product: productObj,
                totalAmount: product.product_price
            })
            await newCart.save();
            res.status(200).json({ error: false, message: 'Product has been moved to cart' })
        }

    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal sever error occured' })
    }
}

export const handleRemoveFromWishlist = async (req, res) => {
    const { id } = req.params
    const { user } = req.session
    try {
        Wishlist.findOneAndUpdate({ userId: user._id },
            { $pull: { product: mongoose.Types.ObjectId(id) } },
            { new: true },
            (err, updatedDoc) => {
                if (err) {
                    res.status(200).json({ error: true, message: 'Somthing went wrong' })
                } else {
                    res.status(200).json({ error: false, message: 'product has been removed', wishlist: updatedDoc })
                }
            }
        )

    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal sever error occured' })
    }
}

