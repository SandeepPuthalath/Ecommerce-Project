import Product from "../model/productModel";


export const checkForProductStock = async (req, res, next) =>{
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if(product.product_quantity == 0){
            console.log("out of stock")
            res.status(200).json({error: true, message: 'Product is out of stock'})
        } else {
            console.log("add to cart")
            next();
        }
    } catch (error) {
        res.status(500).redirect('/error')
    }
}