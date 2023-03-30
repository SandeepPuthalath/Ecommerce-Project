import { addToUserCart, changeCartQuantity, getUserCart, getTotalAmount, removeCartProduct } from "../../helpers/userHelper";
import { getCartItemCount, getWishListCount } from '../../helpers/productHelper';
import Cart from '../../model/cartModel'
import Coupon from "../../model/couponModel";
import Product from "../../model/productModel";


export async function loadUserCart(req, res) {
    try {
        let user = req.session.user;
        let totalAmount = await getTotalAmount(req.session.user._id);
        let product = await getUserCart(user._id);
        const cart = await Cart.findOne({ user: user._id }).lean().exec();
        let cartCount = await getCartItemCount(user);
        let wishlistCount = await getWishListCount(user);

        if (totalAmount == 0) {
            res.render("user/user-cart", {
                user,
                cartIsEmpty: true,
                cartCount,
                wishlistCount,
            });
        } else {
            res.render("user/user-cart", {
                user,
                product,
                totalAmount,
                cartIsEmpty: false,
                cartCount,
                wishlistCount,
                cart
            });
        }
    } catch (err) {
        res.status(500);
    }
}

export async function addToCart(req, res) {
    try {
        const { id } = req.params
        let user = req.session.user;
        let userId = user._id;
        if (user) {
            addToUserCart(userId, id).then(async () => {
                Cart.findOne({ user: user._id }, async (err, cart) => {
                    if (cart.product.length === 0 && cart.coupon) {
                        cart.coupon = null;
                        cart.totalAmount = 0
                        cart.discount = 0;
                        await cart.save();
                        res.status(202).json({ message: 'Product has been add to the cart' });
                    } else if (cart.coupon) {
                        const total = await getTotalAmount(user._id);
                        const coupon = await Coupon.findOne({ code: cart.coupon });
                        cart.discount = Math.ceil((total * coupon.discount) / 100)
                        cart.totalAmount = total - Math.ceil((total * coupon.discount) / 100)
                        await cart.save();
                        res.status(202).json({ message: 'Product has been add to the cart' });
                    } else {
                        const product = await Product.findById(id);
                        cart.coupon = null;
                        cart.totalAmount = product.product_price;
                        cart.discount = 0;
                        await cart.save();
                        res.status(202).json({ message: 'Product has been add to the cart' });
                    }
                });
            });
        } else {
            res.status(404).json({ message: 'Please login first' });
        }
    } catch (err) {
        res.status(500);
    }
}

export async function changeProductQuantity(req, res) {
    const { user } = req.session;
    try {
        changeCartQuantity(req.body).then(async (response) => {
            Cart.findOne({ user: user._id }, async (err, cart) => {
                if (cart.product.length === 0 && cart.coupon) {
                    cart.coupon = null;
                    cart.discount = 0;
                    cart.totalAmount = 0;
                    await cart.save();
                    res.status(202).json({ response: response});
                } else if (cart.coupon) {
                    const total = await getTotalAmount(user._id);
                    const coupon = await Coupon.findOne({ code: cart.coupon });
                    cart.discount = Math.ceil((total * coupon.discount) / 100)
                    cart.totalAmount = total - Math.ceil((total * coupon.discount) / 100)
                    await cart.save();
                    res.status(202).json({ cart: cart, total: total, response: response });
                } else {
                    const total = await getTotalAmount(user._id);
                    cart.totalAmount = total;
                    await cart.save();
                    res.status(202).json({ cart: cart, total: total, response: response });
                }
            });

        }).catch(err => {
            res.status(404).json({ message: `Somthing went wrong` });
        })
    } catch {
        res.status(500).redirect('/error');
    }
}

export function userCartProductRemove(req, res) {
    const { user } = req.session;
    try {
        removeCartProduct(req.body).then((response) => {
            Cart.findOne({ user: user._id }, async (err, cart) => {
                if (cart.product.length === 0 && cart.coupon) {
                    cart.coupon = null;
                    cart.discount = 0
                    cart.totalAmount = 0;
                    await cart.save();
                    res.status(202).json(response);
                } else if (cart.coupon) {
                    const total = await getTotalAmount(user._id);
                    const coupon = await Coupon.findOne({ code: cart.coupon });
                    cart.discount = Math.ceil((total * coupon.discount) / 100)
                    cart.totalAmount = total - Math.ceil((total * coupon.discount) / 100)
                    await cart.save();
                    res.status(202).json(response);
                } else {
                    const total = await getTotalAmount(user._id);
                    cart.totalAmount = total
                    await cart.save();
                    res.status(202).json(response);
                }
            });
        });
    } catch (error) {
        res.status(500).redirect('/error');
    }
}

