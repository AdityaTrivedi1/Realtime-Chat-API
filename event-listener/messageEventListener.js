const {sendPrivateMessage, sendGroupMessage} = require('../controllers/messageController')

const messageEventListener = async (io, socket) => {
    
    socket.on('send-private-message', ({receiver_id, message}, ack) => { 
        sendPrivateMessage({io, socket, receiver_id, message, ack}) 
    })

    socket.on('send-group-message', ({group_id, message}, ack) => { 
        sendGroupMessage({io, socket, group_id, message, ack}) 
    })
}

module.exports = messageEventListener
