let product_helper = require('../helpers/product-helper')

module.exports = {

    loadLandingPage : (req, res) => {
        let user = req.session.user;
        res.render('index', { user,"logged_out" : req.session.loggedOut });
        req.session.loggedOut = false
    },
    productListing :(req, res) =>{
        let user = req.session.user ;
        product_helper.pageProductLoading().then((product) =>{
            product = JSON.parse(JSON.stringify(product));
            res.render('user/product-view',{user, product})
        })    
    }
    ,
    productView :(req, res) =>{
        let productId = req.params.id;
        let user = req.session.user;
        product_helper.productView(productId).then((product) =>{
            product = JSON.parse(JSON.stringify(product));
            res.render('user/product',{ product, user });
        })
       
    },
    getImageZoomPage :(req, res) =>{
        console.log(req.params);
        let id = req.params.id;
        let user = req.session.user;
        res.render('user/image-zoom', {id, user});
    }
}