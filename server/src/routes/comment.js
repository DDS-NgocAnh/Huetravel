const express = require('express')
const router = new express.Router()
const passport = require('passport')

const handlers = require('../modules/comment')
const authenticate = passport.authenticate('jwt', {session: false})

router.post('/:postId', authenticate, handlers.commentPost)

router.post('/reply/:postId/:commentId', authenticate, handlers.replyComment)

router.delete('/:commentId', authenticate, handlers.deleteComment)

//Dev
router.get('/', handlers.getAllComments)
router.delete('/', handlers.deleteAllComments)

module.exports = router