const MemberOf = require('../models/member_of')

const joinSocketRoom = async (socket, next) => {
    const user_id = socket.user_id

    socket.join(user_id)

    next()
}

module.exports = joinSocketRoom
