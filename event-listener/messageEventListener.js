const {sendPrivateMessage} = require('../controllers/messageController')

const messageEventListener = async (io, socket) => {
    
    socket.on('send-private-message', ({receiver_id, message}, ack) => { 
        sendPrivateMessage({io, socket, receiver_id, message, ack}) 
    })
}

module.exports = messageEventListener
