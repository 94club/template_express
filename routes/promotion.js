import express from 'express'
import Hongbao from '../controller/promotion/hongbao'
const router = express.Router()

router.get('/v2/users/:user_id/hongbaos', Hongbao.getHongbao) // 34、可用红包
router.get('/v2/users/:user_id/expired_hongbaos', Hongbao.getExpiredHongbao) // 35、过期红包

export default router