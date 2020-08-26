const express = require('express')
const router = new express.Router()
const passport = require('passport')

const handlers = require('../modules/auth')
const authenticate = passport.authenticate('jwt', {session: false})

router.post('/register', handlers.register)
router.get('/confirm-email/:confirmId', handlers.confirmEmail)
router.post('/login', handlers.login)
router.post('/change-password', authenticate, handlers.changePassword)
router.post('/reset-password', handlers.resetPassword)
router.post('/change-name', authenticate, handlers.changeName)
router.post('/change-avatar', authenticate, handlers.changeAvatar)


//devOnly 
// router.delete('/delete', handlers.deleteAll)

module.exports = router