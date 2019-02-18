import express from 'express'
import Statis from '../controller/statis/statis'
const router = express.Router()

router.get('/api/:date/count', Statis.apiCount) // 40、获取某日API请求量
router.get('/api/count', Statis.apiAllCount) // 41、获取所有API请求量
router.get('/api/all', Statis.allApiRecord)
router.get('/user/:date/count', Statis.userCount) // 42、获取某天用户注册量
router.get('/order/:date/count', Statis.orderCount) // 44、获取某天订单数量
router.get('/admin/:date/count', Statis.adminCount) // 61、获取某天管理员注册量

export default router