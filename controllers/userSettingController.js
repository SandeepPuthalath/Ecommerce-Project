import Orders from "../model/orderModel";


export const handleGetOrderDetails = async (req, res) =>{
    const orderId = req.params.id;
    
    try {
        Orders.findById(orderId, function(err, orderDetails){
        if(err){
           res.status(404).json(`The order is not found`);
        }
        else{
            console.log(orderDetails)
            res.status(202).json(orderDetails);
        }
       }).populate
    } catch (error) {
        res.status(404)
    }
}
