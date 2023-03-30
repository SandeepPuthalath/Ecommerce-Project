import Order from "../../model/orderModel";


export const handleChangeOrderStatus = async (req, res) =>{
    const orderId = req.params.id;
    try {
        Order.findByIdAndUpdate(orderId, req.body,{new: true}, (err, order) =>{
            if(err){
                res.status(401).json({message : `Could not change the status of ${orderId}`});
            }
            else{
                res.status(201).json({message : `Order status has been change for order ID ${orderId}`});
            }
        })
        
    } catch (error) {
        
    }
}

