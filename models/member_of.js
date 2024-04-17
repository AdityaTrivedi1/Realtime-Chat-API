const mongoose = require('mongoose')

const MemberOfSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    group_id: {
        type: String,
        required: true
    },
    privilege: {
        type: String,
        enum: ['creator', 'admin', 'member'],
        required: [true, 'Please provide group member privilge']
    }
})

module.exports = new mongoose.model('member_of', MemberOfSchema)
