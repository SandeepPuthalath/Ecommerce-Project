const userSchema = require('../model/user-model');
const bcrypt = require('bcrypt');
const twilio = require('../middleware/twillio-otp-sending');

module.exports = {
    doSignup :(userData)=>{
        return new Promise( async (resolve, reject) =>{

            let check = await userSchema.findOne({email: userData.email})
            if(check){
                reject({exists : true})
            }
            else{
                userData.password = await bcrypt.hash(userData.password, 10);
                let user = new userSchema({
                    name : userData.name,
                    mobile :userData.mobile,
                    email : userData.email,
                    access : true,
                    password : userData.password
                    
                })
                await user.save()
                resolve(user);
            }
        })
    },
    doLogin :(userData) =>{
        return new Promise( async  (resolve, reject) =>{
            let user = await userSchema.findOne({email : userData.email})
            let response = {};
            if(user){
                bcrypt.compare(userData.password, user.password).then((status)=>{
                    if(status){
                        console.log('success');
                        response.user = user ;
                        response.status = true;
                        resolve(response);
                    }
                    else{
                        console.log('login failed');
                        reject({status : false})
                    }
                })
            }
            else{
                console.log('login failed');
                reject({status : false});
            }
        })
    },
    checkForUser : (mobileNo) =>{
        return new Promise( async (resolve, reject) =>{
            let user = await userSchema.findOne({mobile : mobileNo});
            if(user){
                resolve(user);
            }
            else{
                reject({status : ' there is no such user'});
            }
           
        })
    }
}
