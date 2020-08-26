const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('../auth/User')
const Notification = require('../notification/Notification')
const Post = require('../post/Post')

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    isReply: {
        type: Boolean,
        default: false
    },
    replies: [
        this
    ]
})

module.exports = mongoose.model('Comment', commentSchema)

