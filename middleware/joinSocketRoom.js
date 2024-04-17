const MemberOf = require('../models/member_of')

const joinSocketRoom = async (socket, next) => {
    const user_id = socket.user_id

    socket.join(user_id)

    const groups = await MemberOf.find({user_id}).select('group_id -_id')

    groups.forEach(({group_id}) => {
        socket.join(group_id)
    })
    
    next()
}

module.exports = joinSocketRoom
