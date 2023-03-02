
module.exports = {
    //checking the user login and signup page session
    authenticationCheck: (req, res, next) => {
        if (req.session.user && req.cookies.user_sid) {
            res.redirect('/');
        }
        else {
            next();
        }

    },
// checking for user session 

    userChecking :(req, res, next) =>{
        if(req.session.user && req.cookies.user_sid){
            next()
        }
        else{
            res.redirect('/login');
        }
    },
 
// checking for the session for admin to render login page 
    adminAuthenticationCheck: (req, res, next) => {
        if (req.session.admin && req.cookies.user_sid) {
            res.redirect('/admin')
        }
        else {
            next();
        }
    },
//checking wheather the admin is present or not and loading the pages 
    checkingAdmin: (req, res, next) => {
        if (req.session.admin && req.cookies.user_sid) {
            next();
        }
        else{
            res.redirect('/admin/admin-login');
        }
    }
}