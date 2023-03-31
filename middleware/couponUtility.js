// import Cart from '../model/cartModel'
// import { getTotalAmount } from '../helpers/userHelper'



// export const removeCoupon = async (req, res, next) => {
//     const { user } = req.session;
//     try {
//         const cart = Cart.findOne({ user: user._id }, async (err, cart) => {
//             if (err) {
//                 res.status(200).json({ error: true, message: 'Somthing went wrong' })
//             } else {
//                 if (cart) {
//                     if (cart.coupon) {

//                         const total = await getTotalAmount(user._id);
//                         console.log(total);
//                         cart.coupon = null;
//                         cart.discount = 0;
//                         cart.totalAmount = total;
//                         await cart.save();
//                         next();
//                     } else {
//                         next();
//                     }
//                 }
//             }
//         })

//     } catch (error) {
//         res.status(500).redirect('/error')
//     }
// }