const { json } = require('express');
let product_helper = require('../helpers/productHelper')

module.exports = {

    loadLandingPage: (req, res) => {
        let user = req.session.user;
        product_helper.pageProductLoading().then(async(product) => {
            product = JSON.parse(JSON.stringify(product));
            let banners = await product_helper.bannerLoading();
            banners = JSON.parse(JSON.stringify(banners))
            res.render('index', {user_header: true, user, product, banners,"logged_out": req.session.loggedOut });
            req.session.loggedOut = false
        })
    },
    productListing: (req, res) => { 
        try{
            let user = req.session.user;
            product_helper.pageProductLoading().then((product) => {
                product = JSON.parse(JSON.stringify(product));
                res.render('user/product-view', {user_header : true, user, product })
            }) 
        }
        catch(err){
            res.status(500);
        }
    
    }
    ,
    productView: (req, res) => {

        let productId = req.params.id;
        let user = req.session.user;
        product_helper.productView(productId).then((product) => {
            product = JSON.parse(JSON.stringify(product));
            res.render('user/product', { user_header : true, product, user });
        })

    },
    getImageZoomPage: (req, res) => {
        let id = req.params.id;
        let user = req.session.user;
        res.render('user/image-zoom', {user_header : true, id, user });
    }
}