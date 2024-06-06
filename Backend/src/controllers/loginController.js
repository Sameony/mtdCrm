const userServices = require("../services/userService");

class LoginController {
    addUser = async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ status: false, data: {}, err: "Incomplete arguments received." })
        }

        try {
            let info = await userServices.add_user_by_email(email, password)
            console.log(info)
            return res.json({status: true,data:{msg:`User ${info.user_email} successfully added to the database.`},err: {}})
        } catch (error) {
            return res.json({ status: false, data: {}, err: error })
        }
    }

}

module.exports = LoginController