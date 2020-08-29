const mongoose = require('mongoose')
const Schema = mongoose.Schema
const defaultAvatar = `../../../public/avatar-default.png`

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 20
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    date: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String, 
        default: defaultAvatar
    },
    active: {
        type: Boolean,
        default: false
    },
    confirmId: {
        type: String,
        required: false
    },
    notes:[ 
        {
            post: {
                type: Schema.Types.ObjectId,
                ref: 'Post'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    flowers: [
        {
            post: {
                type: Schema.Types.ObjectId,
                ref: 'Post'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    rocks: [
        {
            post: {
                type: Schema.Types.ObjectId,
                ref: 'Post'
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
    },
})

module.exports =  mongoose.model('User', userSchema)