const jwt = require('jsonwebtoken');
const signToken = (payload) => {
    return jwt.sign(payload, "tidakaman")
}
const verifyToken = (token) => {
    return jwt.verify(token, "tidakaman")
}

module.exports = { signToken, verifyToken }