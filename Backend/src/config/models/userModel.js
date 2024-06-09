const mongoose = require("mongoose")

var UserSchema = new mongoose.Schema(
    {
        user_email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, trim: true },
    }
)

const User = mongoose.model("User", UserSchema)
module.exports = User