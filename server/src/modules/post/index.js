const Post = require('./Post')
const User = require('../auth/User')
const Comment = require('../comment/Comment')
const Notification = require('../notification/Notification')

const { setReactTotalAtPost,
    setReactTotalAtUser,
    decreaseReactTotal,
    removeNoti
} = require('../utils')

const handlers = {
    async getPost(req, res, next) {
        try {
            let id = req.params.postId
            let populateQuery = [
            {path:'writer', select:'name avatar'},
            {path:'comments', model: 'Comment',
            options: { sort: { date: -1 }, limit: 10},
            populate: [{ path: 'replies', model: 'Comment', options: { sort: { date: -1 }}, 
            populate: { path: 'user', select: 'name avatar' }},
            { path: 'user', select: 'name avatar'}]},
            { path: 'notes', select: 'user._id'},
            { path: 'flowers', select: 'user._id'},
            { path: 'rocks', select: 'user._id'},
            ]
            
            let post = await Post.findById(id)
            .populate(populateQuery)

            if(!post) {
                throw new Error('No post found')
            }

            res.json(post)
        } catch (error) {
            next(error)
        }
    },

    async deletePost(req, res, next) {
        try {
            let postId = req.params.postId
            let userId = req.user.id
            let post = await Post.findById(postId)
            .populate({path: 'comments', model: 'Comment', select: '_id replies',
            populate: {path: 'replies', select: '_id'}})

            if(post) {
                if( String(post.writer) == String(userId) ) {
                    let commentList = []
                    post.comments.forEach( comment => {
                        commentList.push(comment._id)
                        comment.replies.forEach( reply => {
                            commentList.push(reply)
                        })
                    })

                    await User.updateOne({_id: post.writer},
                        {$pull: {
                            reviews: postId,
                            notes: {post: postId},
                            flowers: {post: postId},
                            rocks: {post: postId}
                        }})

                    await Comment.deleteMany({ _id: {$in: commentList} })

                    await Post.findByIdAndDelete(postId)
                    decreaseReactTotal(userId, post.flowersTotal, post.rocksTotal)

                    await Notification.find({ post: postId })
                    .exec(async function(err, notis) {
                        if(err) {
                            next(err)
                        } else {
                            if(notis) {
                                notis.forEach(async noti => {
                                    await User.updateMany({ notifications: {$in: noti._id}},
                                    {$pull: {
                                        notifications: noti._id
                                    }})

                                    await Notification.findByIdAndDelete(noti._id)
                                })
                            } 
                        }
                    })

                    res.json({
                        "message": "Your post has been deleted"
                    })    
                } else {
                    throw new Error('Unauthorized')
                }
            } else {
                throw new Error('No post found')
            }

        } catch (error) {
            next(error)
        }
    },

    async createPost(req, res, next) {
        try {
            let data = req.body
            let post
            if (req.user) {
                let userId = req.user.id
                data.writer = userId

                post = await Post.create(data)
                await User.updateOne({ _id: userId }, 
                    { '$push': { 
                        'reviews':  post._id ,
                        $sort: { 'date' : -1}
                    }}, 
                    { safe: true, multi:true })

            } else {
                post = await Post.create(data)
            }

            res.json({message: 'Posted successfully'})
        } catch (error) {
            next(error)
        }
    },

    async reactPost(req, res, next) {
        try {
            let userId = req.user.id
            let postId= req.params.postId
            let reactIcon = req.params.reactIcon
            let toggleIcon = reactIcon === 'flowers' ? 'rocks' : 'flowers'
            let post = await Post.findById(postId)
            let react = reactIcon.substring(0, reactIcon.length - 1)

            if(post) {
                await User.findOne({ "_id": userId, 
                    [reactIcon]: { "$elemMatch": { "post": postId } }
                }).exec(async function(err, user) {
                    if(err) {
                        next(err)
                    } else {
                        if(user) {
                            let notification = await Notification.findOne({ post: postId, [reactIcon]: userId })
                            let notificationId
                            if(notification) {
                                notificationId = notification._id
                            }
                            if(notificationId) {
                                await User.updateOne({ _id: userId }, 
                                    { "$pull": {
                                        notifications: notification.Id
                                    } })
                            }
                            await Notification.findByIdAndDelete(notificationId)
                           
                            await User.updateOne({ _id: userId }, 
                                { "$pull": {
                                    [reactIcon]: { "post": postId },
                                } })
                            await Post.updateOne({ _id: postId }, 
                                { "$pull": {
                                    [reactIcon]: { "user": userId }
                                } })
    
                            setReactTotalAtPost(postId)
                            if(post.toObject().hasOwnProperty('writer')) {
                                setReactTotalAtUser(post.writer)
                            }

                            res.json({message: `Take back the ${react}`})

                        } else {
                            await User.updateOne({ _id: userId }, 
                                { "$push": {
                                    [reactIcon]: { "post": postId },
                                },
                                "$pull": {
                                    [toggleIcon]: { "post": postId },
                                }
                                })
    
                            await Post.updateOne({ _id: postId }, 
                                { "$push": {
                                    [reactIcon]: { "user": userId }
                                },
                                "$pull": {
                                    [toggleIcon]: { "user": userId }
                                }
                                })  
    
                            setReactTotalAtPost(postId)
                            if(post.toObject().hasOwnProperty('writer')) {
                                setReactTotalAtUser(post.writer)
                                let notificationData = {
                                    user: post.writer,
                                    [reactIcon]: userId,
                                    post: postId,                                    
                                }
                                let notification = await Notification.create(notificationData)
                                let removeNotification = await Notification.findOne({ post: postId, [toggleIcon]: userId })

                                let removeNotificationId
                                if(removeNotification) {
                                    removeNotificationId = removeNotification._id
                                }
                                if(removeNotificationId) {
                                    await User.updateOne({ _id: userId }, 
                                        { "$pull": {
                                            notifications: removeNotificationId
                                        } })
                                }
                                await Notification.findByIdAndDelete(removeNotificationId)

                                await User.updateOne({ _id: userId }, 
                                    { "$push": {
                                        notifications: notification._id,
                                    }})
                                
                                }    
                                
                            let successMessage = reactIcon == 'flowers' ? 'Give a flower' : 'Throw a rock'
                            res.json({message: successMessage})
                        }       
                    }
                })
    
            } else {
                throw new Error('No post found')
            }
        } catch (error) {
            next(error)
        }
    },

    async notePost(req, res, next) {
        try {
            let postId= req.params.postId
            let userId = req.user.id

            let post = await Post.findById(postId)

            if(post) {
                await User.findOne({ "_id": userId, 
                    "notes": { "$elemMatch": { "post": postId } }
                }).exec(async function(err, user) {
                    if(err) {
                        next(err)
                    } else {
                        if(user) {
                            await User.updateOne({ _id: userId }, 
                                { "$pull": {
                                    "notes": { "post": postId }
                                }})
                            await Post.updateOne({ _id: postId }, 
                                { "$pull": {
                                    "notes": { user: userId }
                                }})
                            res.json({ "message": "Unsaved from your notes" })
                        } else {
                            await User.updateOne({ _id: userId }, 
                                { "$push": {
                                    "notes": { "post": postId }
                                }})
                            await Post.updateOne({ _id: postId }, 
                                { "$push": {
                                    "notes": { user: userId }
                                }})
                            res.json({ "message": "Saved to your notes" })
                        }         
                    }
                })
            } else {
                throw new Error('No post found')
            }
        } catch (error) {
            next(error)
        }
    },

    async updatePost(req, res, next) {
        try {
            let postId = req.params.postId
            let userId = req.user.id
            let post = await Post.findById(postId)
            if(post) {
                post = await Post.findOne({_id: postId, writer: userId})
                if(post) {
                    const updateFields = {}
                    for(const [key, value] of Object.entries(req.body)){
                        updateFields[key] = value;
                    }

                    await Post.updateOne({_id: postId},
                        { $set: updateFields})

                    res.json({message: 'Updated successfully'})
                } else {
                    throw new Error('Unauthorized')
                }
            } else {
                throw new Error('No post found')
            }

        } catch (error) {
            next(error)
        }
    },

    async getCategoryPosts(req, res, next) {
        try {
            let conditions = {}
            let category = req.params.category
            if(String(category) !='all') {
                conditions.category = category
            }

            let {
                pageIndex = 1,
                search = '',
                sortBy = 'flowers'
              } = req.query

            pageIndex = parseInt(pageIndex)

            let pageSize = 10
            let skip = (pageIndex - 1) * pageSize
            let limit = pageSize

            if(search) {
            conditions.name = new RegExp(search, 'i')
            }

            let count = await Post.countDocuments(conditions)
           
            let posts = await Post
                .find(conditions, '-flowers -comments -rocks -date -category -writer -content')
                .populate({ path: 'notes', select: 'user._id'})
                .skip(skip)
                .limit(limit)
                .sort({
                [sortBy]: -1
                })
            
            res.json({
                posts: posts,
                postsTotal: count})
            
        } catch (error) {
            next(error)
        }
    },

    async getTop3Posts(req, res, next) {
        try {                      
            let posts = await Post
                .find({}, 'name avatar')
                .sort({
                'flowersTotal': -1
                })
                .limit(3)
            
            res.json(posts)
        } catch (error) {
            next(error)
        }
    },

    async getUserPosts(req, res, next) {
        try {
            let conditions = {}
            let category = req.params.category
            let userId = req.params.userId
            if(String(category) !='all') {
                conditions.category = category
            }
            conditions.writer = userId

            let user = await User.findById(userId)
            if(user) {
                let {
                    pageIndex = 1,
                    search = '',
                    sortBy = 'flowers'
                  } = req.query
    
                pageIndex = parseInt(pageIndex)
    
                let pageSize = 10
                let skip = (pageIndex - 1) * pageSize
                let limit = pageSize
    
                if(search) {
                conditions.name = new RegExp(search, 'i')
                }
    
                let count = await Post.countDocuments(conditions)
               
                let posts = await Post
                    .find(conditions, '-flowers -comments -rocks -date -category -writer -content')
                    .populate({ path: 'notes', select: 'user._id'})
                    .skip(skip)
                    .limit(limit)
                    .sort({
                    [sortBy]: -1
                    })
                    
                res.json({
                    posts: posts,
                    postsTotal: count})
            } else {
                throw new Error('No user found')
            }
                
        } catch (error) {
            next(error)
        }
    },

    async deleteAllPosts(req, res, next) {
        try {
            let posts = await Post.deleteMany()
            res.json(posts)
        } catch (error) {
            next(error)
        }
    },

    async getAllPosts(req, res, next) {
        try {
            let posts = await Post.find({})
            res.json(posts)
        } catch (error) {
            next(error)
        }
    },
}

module.exports = handlers