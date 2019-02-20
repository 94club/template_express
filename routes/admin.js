import express from 'express'
import Admin from '../controller/admin/admin'
const router = express.Router()

// router.post('/register', Admin.register)
router.get('/singout', Admin.singout) // 38、管理员退出登录
router.get('/all', Admin.getAllAdmin) // 46、管理员列表
router.get('/count', Admin.getAdminCount) // 47、获取管理员数量
router.get('/info', Admin.getAdminInfo) // 39、管理员信息
router.post('/update/avatar/:admin_id', Admin.updateAvatar)

export default router