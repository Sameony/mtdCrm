const User = require("../config/models/userModel")
const CryptService = require("./crypt-service")
const cryptService = new CryptService()

const userServices = {
    add_user_by_email : _add_user_by_email,
    login_user_by_email : _login_user_by_email,
}

async function _add_user_by_email(email, pass){
    return new Promise(async (resolve, reject)=>{
        let crypted_pass= await cryptService.cryptify(pass)
        // console.log(crypted_pass)
        
        User.create({
            user_email:email,
            password:crypted_pass
        }).then((info)=>resolve(info)).catch(err=>{
            console.log(err)
            reject(err)
        })
    })
}
async function _login_user_by_email(email, pass){
    let data = await User.find({ user_email: { $regex: new RegExp(`^${email}$`, 'i') } }).catch(err=>console.log(err))
    let user = data[0]
    return new Promise(async (resolve, reject)=>{
        if(!user)
            return reject("Invalid credentials.")
        const match = await cryptService.verify(pass, user.password)
        if(match)
            return resolve(`${user.user_email}`)
    })
}

module.exports = userServices