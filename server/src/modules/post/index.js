//TO DO FIX: Not update rocksTotal/flowerstotal in User Model when react posts
// Check when delete post if delete all comment of post in Comment Model

const Post = require('./Post')
const User = require('../auth/User')
const Comment = require('../comment/Comment')

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
            { path: 'user', select: 'name avatar'}]}
            ]
            
            let post = await Post.findById(id)
            .populate(populateQuery)

            if(!post) {
                throw new Error('No post found')
            }

            let postData = post.toObject()
            delete postData.rocks
            delete postData.flowers

            res.json(postData)
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

                    await Comment.deleteMany({ _id: {$in: commentList} })

                    removeNoti(commentList)

                    await Post.findByIdAndDelete(postId)
                    decreaseReactTotal(userId, post.flowersTotal, post.rocksTotal)

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

            res.json(post)
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

            if(post) {
                await User.findOne({ "_id": userId, 
                    [reactIcon]: { "$elemMatch": { "post": postId } }
                }).exec(async function(err, user) {
                    if(err) {
                        next(err)
                    } else {
                        if(user) {
                            await User.updateOne({ _id: userId }, 
                                { "$pull": {
                                    [reactIcon]: { "post": postId }
                                } })
                            await Post.updateOne({ _id: postId }, 
                                { "$pull": {
                                    [reactIcon]: { "user": userId }
                                } })
    
                            setReactTotalAtPost(postId)
                            if(post.toObject().hasOwnProperty('writer')) {
                                setReactTotalAtUser(post.writer)
                            }
    
                        } else {
                            await User.updateOne({ _id: userId }, 
                                { "$push": {
                                    [reactIcon]: { "post": postId }
                                },
                                "$pull": {
                                    [toggleIcon]: { "post": postId }
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
                            }    
                        }       
                    }
                })
    
                res.json({message: "Success"})
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
                            res.json({ "message": "Unsaved from your notes" })
                        } else {
                            await User.updateOne({ _id: userId }, 
                                { "$push": {
                                    "notes": { "post": postId }
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

    async getCategoryPosts(req, res, next) {
        try {
            let conditions = {}
            let category = req.params.category
            conditions.category = category

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

    async getUserPosts(req, res, next) {
        try {
            let conditions = {}
            let category = req.params.category
            let userId = req.params.userId

            conditions.category = category
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