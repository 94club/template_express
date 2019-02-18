import express from 'express'
import Order from '../controller/v1/order'
const router = express.Router()

router.get('/v2/users/:user_id/orders', Order.getOrders) // 31、订单列表
router.get('/v1/users/:user_id/orders/:order_id/snapshot', Order.getDetail) // 32、订单详情
router.get('/orders', Order.getAllOrders) // 45、获取所有订单数量
router.get('/orders/count', Order.getOrdersCount) // 58、获取订单列表

export default router