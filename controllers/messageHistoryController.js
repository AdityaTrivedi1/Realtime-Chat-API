const User = require('../models/user')
const Group = require('../models/group')
const MessagesUser = require('../models/messages_user')
const MessagesGroup = require('../models/messages_group')
const MemberOf = require('../models/member_of')
const {StatusCodes} = require('http-status-codes')

const getPrivateMessageHistory = async (req, res) => {
    const {receiver_id} = req.headers
    const {user_id: sender_id} = req.body
    if (!receiver_id) {
        res.status(StatusCodes.BAD_REQUEST).send('Please specify receiver id')
        return
    }

    if (sender_id === receiver_id) {
        res.status(StatusCodes.BAD_REQUEST).send('receiver id cannot be same as sender id')
        return
    }

    if (!await User.findOne({user_id: receiver_id})) {
        res.status(StatusCodes.BAD_REQUEST).send('Given receiver id does not exist')
        return
    }

    let messages = await MessagesUser.find({$or: [{sender_id, receiver_id}, {sender_id: receiver_id, receiver_id: sender_id}]})
                                     .select('sender_id message timestamp -_id')

    res.status(StatusCodes.OK).json({messages})
}

const getGroupMessageHistory = async (req, res) => {
    const {group_id} = req.headers
    const {user_id: sender_id} = req.body
    if (!group_id) {
        res.status(StatusCodes.BAD_REQUEST).send('Please specify group id')
        return
    }

    if (!await MemberOf.findOne({user_id: sender_id}) || !await Group.findOne({group_id})) {
        res.status(StatusCodes.BAD_REQUEST).send('Given group id does not exist')
        return
    }

    let messages = await MessagesGroup.find({group_id}).select('sender_id message timestamp -_id')

    res.status(StatusCodes.OK).json({messages})
}

module.exports = {getPrivateMessageHistory, getGroupMessageHistory}
