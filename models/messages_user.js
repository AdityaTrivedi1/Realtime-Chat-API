const mongoose = require('mongoose')

const messagesUserSchema = new mongoose.Schema({
    sender_id: {
        type: String,
        required: true
    },
    receiver_id: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
        minLength: 1,
        maxLength: 250
    }
})

messagesUserSchema.pre('save', async function() {
    const IndianTime = new Date().toLocaleString('en-US', {timezone: 'Asia/Kolkata'})
    const timestamp = new Date(IndianTime)
    this.timestamp = timestamp
})

module.exports = mongoose.model('messages_user', messagesUserSchema)
