const User = require("../config/models/userModel")
const CryptService = require("./crypt-service")
const cryptService = new CryptService()

const userServices = {
    add_user_by_email : _add_user_by_email,
}

async function _add_user_by_email(email, pass){
    return new Promise(async (resolve, reject)=>{
        let crypted_pass= await cryptService.cryptify(pass)
        console.log(crypted_pass)
        
        User.create({
            user_email:email,
            password:crypted_pass
        }).then((info)=>resolve(info)).catch(err=>{
            console.log(err)
            reject(err)
        })
    })
}

module.exports = userServices