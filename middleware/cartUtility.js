import Cart from '../model/cartModel'

export const checkCartProduct = async (req, res, next) => {
    const { user } = req.session
    try {
        const cart = await Cart.findOne({ user: user._id });
        if (cart) {
            if (cart.product.length) {
                next()
            } else {
                res.status(200).redirect('/api/user/cart')
            }
        } else {
            res.status(200).redirect('/api/user/cart')
        }
    } catch (error) {
        res.status(500).redirect('/error');
    }
}