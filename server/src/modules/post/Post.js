const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('../auth/User')

const postSchema = new Schema({
    avatar: {
        type: String,
        required: true
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
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'      
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

postSchema.pre('deleteOne', async function(next) {
    const postId = this.getQuery()["_id"]
    await User
    .updateMany({$or: [
        { 'reviews': {$in: postId} },
        { 'notes': {$in: postId} },
        { 'flowers': {$in: postId} },
        { 'rocks': {$in: postId} }
      ]}, { "$pull":  { "reviews" : { "post": postId },
                                "notes": { "post": postId },
                                "flowers": { "post": postId },
                                "rocks": { "post": postId } }})
    next()
})

module.exports =  mongoose.model('Post', postSchema)