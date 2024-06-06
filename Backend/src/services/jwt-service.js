const jwt = require('jsonwebtoken')
const {promisify} = require("util")

const jwt_sign = promisify(jwt.sign)
const jwt_decode = promisify(jwt.decode)
const jwt_verify = promisify(jwt.verify)

class JwtService {
    generateToken(data)
    {
        return jwt_sign(JSON.stringify(data), "secret key")
    }
    verifyToken(token)
    {
        return jwt_verify(token, "secret key")
    }
    decodeToken(token)
    {
        return jwt_decode(token)
    }
}

module.exports = JwtService