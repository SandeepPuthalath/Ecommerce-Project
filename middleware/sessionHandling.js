
export function authenticationCheck(req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/');
    }
    else {
        next();
    }

}
export function userChecking(req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        next();
    }
    else {
        res.redirect('/login');
    }
}
export function adminAuthenticationCheck(req, res, next) {
    if (req.session.admin && req.cookies.user_sid) {
        res.redirect('/admin');
    }
    else {
        next();
    }
}
export function checkingAdmin(req, res, next) {
    if (req.session.admin && req.cookies.user_sid) {
        next();
    }
    else {
        res.redirect('/admin/admin-login');
    }
}