const authenticate = require('../middleware/authenticate')
const getUserAndGroups = require('../controllers/availableContactController')

const express = require('express')

const router = express.Router()

router.get('/', authenticate, getUserAndGroups)

module.exports = router
