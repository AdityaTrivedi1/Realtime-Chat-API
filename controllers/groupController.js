const User = require('../models/user')
const Group = require('../models/group')
const MemberOf = require('../models/member_of')

const createGroup = async ({io, socket, group_id, groupname, description, members, ack}) => {
    const creator_id = socket.user_id

    if (!group_id || !groupname || !members) {
        ackError(ack, 'Please provide group id, group name and members list of user id')
        return
    }

    if (await Group.findOne({group_id})) {
        ackError(ack, 'Given group id cannot be used')
        return
    }

    if (members.length > 99) {
        ackError(ack, 'A group cannot have more than 100 members')
        return
    }

    for (z = 0; z < members.length; z++) {
        if (members[z] === creator_id) {
            ackError(ack, 'Members list should not contain creator user id')
            return
        }

        if (!await User.findOne({user_id: members[z]})) {
            ackError(ack, 'Given user id in member list does not exist')
            return
        }
    }

    const IndianTime = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
    const timestamp = new Date(IndianTime)

    await Group.create({group_id, description, groupname, creation_date: timestamp, no_of_members: (members.length+1)})

    for (z = 0; z < members.length; z++) {
        await MemberOf.create({user_id: members[z], group_id, privilege: 'member'})
    }
    await MemberOf.create({user_id: creator_id, group_id, privilege: 'creator'})

    ack({status: 'success'})

    for (z = 0; z < members.length; z++) {
        io.to(members[z]).emit('group-created', {
            group_id, 
            groupname, 
            description, 
            creation_date: timestamp, 
            no_of_members: (members.length+1),
            members: [...members, creator_id]
        })
    }
    io.to(creator_id).emit('group-created', {
        group_id, 
        groupname, 
        description, 
        creation_date: timestamp, 
        no_of_members: (members.length+1),
        members: [...members, creator_id]
    })
}

const addGroupMember = async ({io, socket, group_id, new_member_id, ack}) => {
    const user_id = socket.user_id

    if (!group_id || !new_member_id) {
        ackError(ack, 'Please provide group id and new member user id')
        return
    }

    if (!await Group.findOne({group_id})) {
        ackError(ack, 'Given group id does not exist')
        return
    }

    if (!await User.findOne({user_id: new_member_id})) {
        ackError(ack, 'Given new member id does not exist')
        return
    }

    if (await MemberOf.findOne({user_id: new_member_id, group_id})) {
        ackError(ack, 'Member already exists in the group')
        return
    }

    const {privilege} = await MemberOf.findOne({user_id, group_id}).select('privilege -_id')
    if (privilege !== 'creator' && privilege !== 'admin') {
        ackError(ack, 'You do not have sufficient privilege to add member')
        return 
    }

    await MemberOf.create({user_id: new_member_id, group_id, privilege: 'member'})
    await Group.findOneAndUpdate({group_id}, {"$inc": {no_of_members: 1}}, {
        new: true,
        runValidators: true
    })
    ack({status: 'success'})

    io.to(group_id).emit('added-group-member', {group_id, new_member_id})
    io.to(new_member_id).emit('added-group-member', {group_id, new_member_id})
}

const changePrivilege = async ({io, socket, group_id, member_id, new_privilege, ack}) => {
    const user_id = socket.user_id

    if (!group_id || !member_id || !new_privilege) {
        ackError(ack, 'Please provide group id, member id and new privilege')
        return
    }

    if (!await Group.findOne({group_id})) {
        ackError(ack, 'Given group id does not exist')
        return
    }

    if (!await User.findOne({user_id: member_id})) {
        ackError(ack, 'Given member id does not exist')
        return
    }

    if (user_id === member_id) {
        ackError(ack, 'You cannot change your own privilege')
        return
    }

    if (!await MemberOf.findOne({user_id: member_id, group_id})) {
        ackError(ack, 'Given member id is not part of given group id')
        return
    }

    const {privilege: privilege_user} = await MemberOf.findOne({user_id, group_id}).select('privilege -_id')
    const {privilege: privilege_member} = await MemberOf.findOne({user_id: member_id, group_id}).select('privilege -_id')

    if (privilege_user === 'member') {
        ackError(ack, 'You do not have sufficient privilege to change others privilege')
        return
    }

    if (privilege_member === 'creator') {
        ackError(ack, 'Privilege of creator cannot be changed')
        return
    }

    if (new_privilege === 'creator') {
        ackError(ack, 'Neither admin nor member can be made creator of group')
        return
    }

    if (privilege_member === new_privilege) {
        ackError(ack, 'Old privilege is same as new privilege')
        return
    }

    await MemberOf.findOneAndUpdate({user_id: member_id, group_id}, {privilege: new_privilege}, {
        new: true,
        runValidators: true
    })

    ack({status: 'success'})

    io.to(group_id).emit('changed-privilege', {group_id, member_id, old_privilege: privilege_member, new_privilege})
}

const ackError = (ack, err_msg) => {
    ack({
        status: 'error',
        err_msg
    })
}

module.exports = {
    createGroup,
    addGroupMember,
    changePrivilege
}
