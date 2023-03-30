import Orders from "../../model/orderModel";
import Product from '../../model/productModel'


export const handleGetOrderDetails = async (req, res) => {
    const orderId = req.params.id;
    const user = req.session.user;
    console.log(orderId)
    try {
        Orders.findById(orderId).lean().exec(async (err, order) => {
            if (err) {
                res.status(404).redirect('/error');
            }
            else {
                const orderedItems = order.orderedItems
                const itemsDetailsPromise = orderedItems.map(async (orderedItem) => {
                    const product = await Product.findOne({ _id: orderedItem.item }).lean()
                    return {
                        item: product,
                        quantity: orderedItem.quantity
                    }
                })
                const itemDetails = await Promise.all(itemsDetailsPromise);
                res.render('user/order-details', { user_header: true, user, itemDetails, order });
            }
        })
    } catch (error) {
        res.status(404).redirect('/error')
    }
}
