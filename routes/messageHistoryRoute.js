const {getPrivateMessageHistory} = require('../controllers/messageHistoryController')
const authenticate = require('../middleware/authenticate')

const express = require('express')
const router = express.Router()

router.get('/private', authenticate, getPrivateMessageHistory)

module.exports = router
