const express = require('express')
const router = new express.Router()
const passport = require('passport')

const handlers = require('../modules/post')

const authenticate = passport.authenticate('jwt', {session: false})

router.put('/:postId', authenticate, handlers.updatePost)

router.get('/all/top-3-posts', handlers.getTop3Posts)

router.get('/all/:category/', handlers.getCategoryPosts)

router.get('/user/:userId/:category', handlers.getUserPosts)

router.post('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), handlers.createPost)

router.delete('/:postId', authenticate, handlers.deletePost)

router.post('/note/:postId', authenticate, handlers.notePost)

//devOnly 
// router.get('/', handlers.getAllPosts)
// router.delete('/', handlers.deleteAllPosts)


module.exports = router