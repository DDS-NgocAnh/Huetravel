const Comment = require('./Comment')
const Post = require('../post/Post')
const Notification = require('../notification/Notification')
const User = require('../auth/User')

const { removeNoti } = require('../utils')

const handlers = {
    async commentPost(req, res, next) {
        try {
            let postId = req.params.postId
            let postExist = await Post.findById(postId)

            if(postExist) {
                let data = req.body
                data.user = req.user.id

                let comment = await Comment.create(data)
                await Post.updateOne({_id: postId},
                    { $push: {
                        comments: comment._id
                    }})
                
                let post = await Post.findOne({ _id: postId, writer: {$exists: true} })

                if(post && (String(comment.user) != String(post.writer))) {
                    let notificationData = {
                        user: post.writer,
                        comment: comment._id,
                        commenter: req.user.id,
                        post: postId,
                        date: comment.date
                    }
    
                    let notification = await Notification.create(notificationData)

                    await User.updateOne({ _id: post.writer }, {
                        $push: { notifications: notification._id }
                    })
                }

                res.json({"message": 'Comment successful'})
            } else {
                throw new Error('No post found')
            }
        } catch (error) {
            next(error)
        }
    },

    async replyComment(req, res, next) {
        try {
            let commentId = req.params.commentId
            let postId = req.params.postId
            let data = req.body
            data.user = req.user.id

            let comment = await Comment.findById(commentId)
            if(comment) {
                let reply = await Comment.create(data)
                await Comment.updateOne({_id: commentId},
                    { $push: {
                        replies: reply._id
                    }})
                
                let post = await Post.findOne({ _id:postId, writer: {$exists: true} })

                let notificationData = {
                    comment: reply._id,
                    post: postId,
                    date: reply.date
                }

                if(String(reply.user) != String(comment.user)) {
                    notificationData.user = comment.user
                    notificationData.replier = req.user.id

                    let notification = await Notification.create(notificationData)

                    await User.updateOne({_id: comment.user}, {
                        $push: {notifications: notification._id}
                })
                }

                if(post && (String(reply.user) != String(post.writer))) {
                    notificationData.user = post.writer
                    notificationData.commenter = req.user.id

                    let notification = await Notification.create(notificationData)

                    await User.updateOne({_id: post.writer}, {
                        $push: { notifications: notification._id }
                    })    
                }
                
                res.json({"message": 'Reply successful'})
            } else {
                throw new Error('No comment found')
            }
        } catch (error) {
            next(error)
        }
    },

    async deleteComment(req, res, next) {
        try {
            let commentId = req.params.commentId
            let comment = await Comment.findById(commentId)
            if(comment) {
                if(String(comment.user) == String(req.user.id)) {
                    let replies = comment.replies
                    replies.push(commentId)

                    await Comment.findByIdAndDelete(commentId)
                    await Comment.updateMany({ replies: {$in: commentId} },
                        {$pull: {
                            replies: commentId
                        }})
    
                    await Post.updateOne({ _id: comment.post },
                        {$pull: {
                            comments: commentId
                        }})

                    removeNoti(replies)
    
                    res.json({"message": "Delete comment successful"})
                } else {
                    throw new Error('Unauthorized')
                }
            } else {
                throw new Error('No comment found')
            }
        } catch (error) {
            next(error)
        }
    },

    async deleteAllComments(req, res, next) {
        try {
            let cmts = await Comment.deleteMany()
            res.json(cmts)
        } catch (error) {
            next(error)
        }
    },

    async getAllComments(req, res, next) {
        try {
            let cmts = await Comment.find()
            res.json(cmts)
        } catch (error) {
            next(error)
        }
    },
}

module.exports = handlers