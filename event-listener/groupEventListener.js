const {createGroup, addGroupMember, changePrivilege} = require('../controllers/groupController')

const groupEventListener = async (io, socket) => {
    
    socket.on('create-group', ({group_id, groupname, description, members}, ack) => {
        createGroup({io, socket, group_id, groupname, description, members, ack})
    })

    socket.on('add-group-member', ({group_id, new_member_id}, ack) => {
        addGroupMember({io, socket, group_id, new_member_id, ack})
    })

    socket.on('change-privilege', ({group_id, member_id, new_privilege}, ack) => {
        changePrivilege({io, socket, group_id, member_id, new_privilege, ack})
    })
}

module.exports = groupEventListener
