let admin = {
    name: "Admin Sandeeep",
    email: "admin@gmail.com",
    password: "admin",
};

// rendering the login page 
export const handleGetLogin = async (req, res) =>{
    try {
        res.render('admin/admin-login')
    } catch (error) {
        res.status(500);
    }
}

// posting the login 
export const handlePostLogin = async (req, res) =>{
    try {
        if(req.body){
            if(req.body.email === admin.email && req.body.password === admin.password){
                req.session.admin = admin;
                res.status(201).json({message : 'Login has been succesfull'})
            } else {
                res.status(401).json({message : 'email or password is invalid'})
            }
        }
        else {
            res.status(401).json({message : 'pleace provide valid inputs'})
        }
    } catch (error) {
        
    }
}


//admin logout api

export const handleAdminLogout = async (req, res) =>{
    try {
        console.log('logging out')
        req.session.admin = null
        res.status(201).redirect('/api/admin/auth')
    } catch (error) {
        res.status(500)
    }
}