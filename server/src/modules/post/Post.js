const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('../auth/User')

const defaultAvatar = `../../../public/uploads/image-default.png`

const postSchema = new Schema({
    avatar: {
        type: String,
        default: defaultAvatar
    },
    category: {
        type: String,
        required: true,
        enum: ['attraction', 'restaurant', 'cafe', 'shopping']
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    },
    flowers: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    notes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    rocks: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],

    flowersTotal: {
        type: Number,
        default: 0,
        min: 0
    },
    rocksTotal: {
        type: Number,
        default: 0,
        min: 0
    }
})

module.exports =  mongoose.model('Post', postSchema)