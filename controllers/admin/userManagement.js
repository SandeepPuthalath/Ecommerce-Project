import User from '../../model/userModel'

// getting User details in admin side
export const HandleGetAllUser = async (req, res) =>{
    try {
        const admin = req.session.admin;
        const users = await User.find({}).sort({createdAt : -1}).lean();
        console.log(users)
        res.render('admin/all-user',{ admin, users})
    } catch (error) {
        res.status(500);
    }
}

export const handleBlockUser = async (req, res) =>{
    const userId = req.params.id;
    try {
        if(!userId){
            res.status(401).json({message : `please provide a valid user id`})
        }
        else{
             User.findById(userId, async (err, user) =>{
                if(err){
                    res.status(401).json({message : `please provide a valid user id`})
                } else {
                    user.blocked = !user.blocked;
                    await user.save();
                    res.status(201).json({message : `User had been blocked`})
                }
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message : 'Internal server error'})
    }
}