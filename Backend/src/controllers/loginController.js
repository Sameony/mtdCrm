const userServices = require("../services/userService");

class LoginController {
    addUser = async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ status: false, data: {}, err: "Incomplete arguments received." })
        }

        try {
            let info = await userServices.add_user_by_email(email, password)
            
            return res.stats(201).json({status: true,data:{msg:`User ${info.user_email} successfully added to the database.`},err: {}})
        } catch (error) {
            return res.status(400).json({ status: false, data: {}, err: error })
        }
    }

    loginUser = async (req, res, next) => {
        
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ status: false, data: {}, err: "Incomplete arguments received." })
        }
        try {
            let info = await userServices.login_user_by_email(email, password)
            
            return res.status(200).json({status: true,data:info,err: {}})
        } catch (error) {
            return res.status(200).json({ status: false, data: {}, err: error })
        }
    }

}

module.exports = new LoginController();