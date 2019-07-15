var express = require('express')
var router = express.Router()
import User from '../controller/user'

/* GET home page. */
router.get('/getUserInfo', User.getUserInfo)
router.post('/logout', User.logout)

module.exports = router