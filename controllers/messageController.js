const User = require('../models/user')
const Group = require('../models/group')
const MessagesUser = require('../models/messages_user')
const MessagesGroup = require('../models/messages_group')
const MemberOf = require('../models/member_of')

const sendPrivateMessage = async ({io, socket, receiver_id, message, ack}) => {
    const sender_id = socket.user_id

    if (!receiver_id || !message) {
        ack({
            status: 'error',
            err_msg: 'Please provide receiver id and message'
        })
        return 
    }
    
    if (!await User.findOne({user_id: receiver_id})) {
        ack({
            status: 'error',
            err_msg: 'Receiver id does not exist'
        })
        return
    }
    
    const IndianTime = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
    const timestamp = new Date(IndianTime)
    
    await MessagesUser.create({sender_id, receiver_id, message, timestamp})
    ack({status: 'success'})
    
    io.to(sender_id).emit('receive-private-message', {sender_id, receiver_id, message, timestamp})
    io.to(receiver_id).emit('receive-private-message', {sender_id, receiver_id, message, timestamp})
}

const sendGroupMessage = async ({io, socket, group_id, message, ack}) => {
    const sender_id = socket.user_id

    if (!group_id || !message) {
        ack({
            status: 'error',
            err_msg: 'Please provide group_id and message'
        })
        return 
    }

    if (!await Group.findOne({group_id}) || !await MemberOf.findOne({user_id: sender_id, group_id})) {
        ack({
            status: 'error',
            err_msg: 'Given group id does not exist'
        })
        return
    }

    const IndianTime = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
    const timestamp = new Date(IndianTime)

    await MessagesGroup.create({sender_id, group_id, message, timestamp})
    ack({status: 'success'})

    io.to(group_id).emit('receive-group-message', {sender_id, group_id, message, timestamp})
}

module.exports = {sendPrivateMessage, sendGroupMessage}
