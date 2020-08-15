const express = require('express')
const router = new express.Router()
const passport = require('passport')

const handlers = require('../modules/post')

const authenticate = passport.authenticate('jwt', {session: false})

router.get('/:postId', handlers.getPost)

router.get('/all/:category/', handlers.getCategoryPosts)

router.get('/user/:userId/:category/', handlers.getUserPosts)

router.post('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), handlers.createPost)

router.delete('/:postId', authenticate, handlers.deletePost)

router.post('/react/:reactIcon/:postId/', authenticate, handlers.reactPost)

router.post('/note/:postId', authenticate, handlers.notePost)

//devOnly 
router.get('/', handlers.getAllPosts)
router.delete('/', handlers.deleteAllPosts)


module.exports = router