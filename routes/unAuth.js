let express = require('express');
let router = express.Router();
import Admin from '../controller/admin/admin'
import User from '../controller/v2/user'
import Captcha from '../controller/v1/captcha'
import CityHandle from '../controller/v1/cities'

router.post('/userLogin', User.login)
router.get('/userSignout', User.signout) // 26、退出
router.post('/adminLogin', Admin.login) // 37、管理员登录
router.get('/adminSignout', User.signout) // 26、退出
router.post('/captcha', Captcha.getCaptcha) // 23、获取验证码
router.get('/cities', CityHandle.getCity) // 1 获取城市列表
router.get('/cities/:id', CityHandle.getCityById) //  2 获取所选城市信息
module.exports = router