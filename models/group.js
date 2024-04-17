const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    group_id: {
        type: String,
        unique: true,
        required: [true, 'Please provide a group id'],
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    groupname: {
        type: String,
        required: [true, 'Please provide a group name'],
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    description: {
        type: String,
        trim: true,
        maxLength: 120
    },
    creation_date: {
        type: Date
    },
    no_of_members: {
        type: Number,
        min: 1,
        max:100
    }
})

groupSchema.pre('save', async function() {
    const IndianTime = new Date().toLocaleString('en-US', {timezone: 'Asia/Kolkata'})
    const creationDate = new Date(IndianTime)
    this.creation_date = creationDate
})

module.exports = mongoose.model('group', groupSchema)
