let express = require('express');
let router = express.Router();
import User from '../controller/user'

router.post('/login', User.login)
module.exports = router