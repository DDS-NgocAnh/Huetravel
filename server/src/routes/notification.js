const express = require('express')
const router = new express.Router()
const passport = require('passport')

const handlers = require('../modules/notification')
const authenticate = passport.authenticate('jwt', {session: false})

router.get('/', authenticate, handlers.getNotification)
router.post('/:notificationId', authenticate, handlers.readNotification, handlers.getNotification)

//Dev

router.delete('/', handlers.deleteAllNotis)
router.get('/all', handlers.getAllNotis)


module.exports = router