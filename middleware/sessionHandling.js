
export function authenticationCheck(req, res, next) {
    try {
        if (req.session.user && req.cookies.user_sid) {
            res.redirect('/');
        }
        else {
            next();
        }

    } catch (error) {
        res.status(500).redirect('/error')
    }

}
export function userChecking(req, res, next) {
    try {
        if (req.session.user && req.cookies.user_sid) {
            next();
        }
        else {
            res.redirect('/login');
        }
    } catch (error) {
        res.status(500).redirect('/error')
    }
}
export function adminAuthenticationCheck(req, res, next) {
    try {

        if (req.session.admin && req.cookies.user_sid) {
            res.redirect('/admin');
        }
        else {
            next();
        }
    } catch (error) {
        res.status(500).redirect('/error')
    }
}
export function checkingAdmin(req, res, next) {
    try {

        if (req.session.admin && req.cookies.user_sid) {
            next();
        }
        else {
            res.redirect('/api/admin/auth');
        }
    } catch (error) {
        res.status(500).redirect('/error')
    }
}