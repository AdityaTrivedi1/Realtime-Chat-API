const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')

const authenticate = async (req, res, next) => {
    try {
        const {token} = req.headers
        const {user_id} = jwt.verify(token, process.env.JWT_SECRET)

        req.body.user_id = user_id
        next()
    } catch (err) {
        res.status(StatusCodes.UNAUTHORIZED).send('User not logged in')
    }
}

module.exports = authenticate
