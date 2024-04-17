const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')

const authenticateWebsocket = async (socket, next) => {
    try {
        const token = socket.handshake.headers.token
        const {user_id} = jwt.verify(token, process.env.JWT_SECRET)
        socket.user_id = user_id
        next()
    } catch (err) {
        next(new Error('User is not logged in'))
    }
}

module.exports = authenticateWebsocket
