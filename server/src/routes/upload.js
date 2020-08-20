const express = require('express')

const router = new express.Router()

const handlers = require('../modules/upload')

router.post('/photo', handlers.uploadPhoto)
router.post('/ckfinder', handlers.uploadCKFinder)


module.exports = router