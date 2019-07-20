let express = require('express');
let router = express.Router();
import User from '../controller/user'

router.post('/v1/login', User.login)
module.exports = router