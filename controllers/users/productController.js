import Category from "../../model/categoryModel";
import Product from "../../model/productModel";



export const handleGetProduct = async (req, res) => {
    try {
        const user = req.session.user;
        const products = await Product.find().lean();
        const categories = await Category.find({ status: true }).lean();
        res.status(201).render('user/product-view', { products, categories, user, user_header: true })

    } catch (error) {
        res.status(500).redirect('/error')
    }
}

export const handleProductSearch = async (req, res) => {
    try {
        let payload = req.body.payload.trim();
        let search = await Product.find({ product_name: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
        search = search.slice(0, 10);
        res.send({ payload: search })
    } catch (error) {
        res.status(500).redirect('/error');
    }
}

export const handleProductSearchResult = async (req, res) => {
    const { name } = req.query;
    const user = req.session.user;
    try {
        let search = await Product.find({ product_name: { $regex: new RegExp('^' + name + '.*', 'i') } }).limit(10).lean().exec();
        let categories = await Category.find({ status: true }).lean().exec();
        res.status(200).render('user/product-search-result', { user_header: true, search, categories, user })
    } catch (error) {
        res.status(500).redirect('/error');
    }
}

export const handleCategoryFiltering = async (req, res) => {
    const { user } = req.session;
    const { category } = req.query;
    try {
        const products = await Product.find({ product_category: { $regex: new RegExp('^' + category + '.*', 'i') } }).lean().exec();
        const categories = await Category.find({ status: true }).lean().exec();
        res.status(200).render('user/product-view', { user, user_header: true, products, categories })

    } catch (error) {
        res.status(500).redirect('/error');
    }
}