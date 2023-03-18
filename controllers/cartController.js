import { addToUserCart, changeCartQuantity, getUserCart, getTotalAmount,removeCartProduct } from "../helpers/userHelper";
import {getCartItemCount, getWishListCount } from '../helpers/productHelper';




export async function loadUserCart(req, res) {
    try {
        let user = req.session.user;
        let totalAmount = await getTotalAmount(req.session.user._id);
        let product = await getUserCart(user._id);
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
            });
        }
    } catch (err) {
        res.status(500);
    }
}

export function addToCart(req, res) {
    try {
        let user = req.session.user;
        let id = req.params.id;
        let userId = user._id;
        if (user) {
            addToUserCart(userId, id).then(() => {
                res.json({ status: true });
            });
        } else {
            res.json({ status: false });
        }
    } catch (err) {
        res.status(500);
    }
}

export async function changeProductQuantity(req, res, next) {
    try {
        changeCartQuantity(req.body).then(async (response) => {
            response.totalAmount = await getTotalAmount(req.body.user);
            res.json(response);
        });
    } catch {
        res.status(500);
    }
}


export function userCartProductRemove(req, res) {
    console.log('remove cart')
    removeCartProduct(req.body).then((response) => {
        res.json(response);
    });
}

