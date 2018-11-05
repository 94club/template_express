let express = require('express');
let router = express.Router();
import User from '../controller/user'

/* GET home page. */
router.post('/login', User.login)
module.exports = router;