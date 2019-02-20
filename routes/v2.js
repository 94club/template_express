import express from 'express'
import Entry from '../controller/v2/entry'
import CityHandle from '../controller/v1/cities'
import User from '../controller/v2/user'
const router = express.Router()

router.get('/index_entry', Entry.getEntry) // 5、食品分类列表
router.get('/getInfo', User.getInfo)
router.get('/pois/:geohash', CityHandle.pois) // 4、根据经纬度详细定位
router.post('/changepassword', User.chanegPassword) // 27、修改密码

export default router