import Coupon from "../../model/couponModel";
import Cart from "../../model/cartModel";
import { getTotalAmount } from '../../helpers/userHelper'
import { get } from "mongoose";

export const handleApplyCoupon = async (req, res) => {
    const { code } = req.query;
    const { user } = req.session;
    try {
        Coupon.findOne({ code: code }, (err, coupon) => {
            if (err) {
                res.status(404).json({ message: 'Somthing went wrong' })
            } else if (!coupon) {
                res.status(200).json({ error: true, message: 'The coupon does not exist' })
            } else if (coupon.isActive === "Expired") {
                res.status(200).json({ error: true, message: 'The coupon is expired' })
            } else {

                Cart.findOne({ user: user._id }, async (err, cart) => {
                    if (err) {
                        res.status(404).json({ message: 'Somthing went wrong' })
                    } else {
                        const { discount } = coupon;
                        const total = await getTotalAmount(user._id)
                        const discountAmount = Math.ceil((total * discount) / 100)

                        cart.coupon = coupon.code;
                        cart.discount = discountAmount
                        cart.totalAmount = total - discountAmount
                        await cart.save();
                        res.status(200).json({ error: false, message: 'Coupon has been applied', cart: cart });
                    }
                })
            }
        });

    } catch (error) {
        res.status(500).redirect('/error');
    }
}

export const handleRemoveCoupon = async (req, res) => {
    const { cartId } = req.query;
    const { user } = req.session;
    try {
        Cart.findById(cartId, async (err, cart) => {
            if (err) {
                res.status(200).json({ error: true, message: 'Somthing went wrong' })
            } else {
                if (cart.coupon && cart.product.length) {
                    const total = await getTotalAmount(user._id);
                    cart.coupon = null
                    cart.discount = 0;
                    cart.totalAmount = total;
                    console.log(total)
                    await cart.save();
                    res.status(200).json({ error: false, message: 'Coupon has been removed', cart: cart })
                } else {

                    res.status(200).json({ error: false, message: 'Coupon has been removed', cart: cart })
                }
            }
        })

    } catch (error) {
        res.status(500).redirect('/error')
    }
}


// Coupon.findOne({ code: couponCode }, function(err, coupon) {
//     if (err) {
//       // Handle the error here
//     } else if (!coupon) {
//       // Coupon not found
//     } else if (coupon.usersUsed.includes(userId)) {
//       // Coupon already used by the user
//     } else {
//       // Apply the coupon here
//       coupon.usersUsed.push(userId);
//       coupon.save(function(err) {
//         // Handle the error here
//       });
//     }
//   });
