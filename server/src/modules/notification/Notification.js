const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = require('../auth/User')

const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'    
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread'
    },
    commenter: {
            type: Schema.Types.ObjectId,
            ref: 'User'
    },
    replier: {
            type: Schema.Types.ObjectId,
            ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Notification', notificationSchema)

