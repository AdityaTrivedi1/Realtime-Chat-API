const {getPrivateMessageHistory, getGroupMessageHistory} = require('../controllers/messageHistoryController')
const authenticate = require('../middleware/authenticate')

const express = require('express')
const router = express.Router()

router.get('/private', authenticate, getPrivateMessageHistory)
router.get('/group', authenticate, getGroupMessageHistory)

module.exports = router
