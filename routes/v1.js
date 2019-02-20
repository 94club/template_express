import SearchPlace from '../controller/v1/search'
import Carts from '../controller/v1/carts'
import Address from '../controller/v1/address'
import Remark from '../controller/v1/remark'
import BaseComponent from '../prototype/baseComponent'

import User from '../controller/v2/user'
import Order from '../controller/v1/order'
import Hongbao from '../controller/promotion/hongbao'
import express from 'express'
const baseHandle = new BaseComponent()
const router = express.Router()


router.get('/pois', SearchPlace.search) // 3、搜索地址
router.post('/addimg/:type', baseHandle.uploadImg) // 12、上传图片
router.post('/carts/checkout', Carts.checkout) // 20、加入购物车
router.get('/carts/:cart_id/remarks', Remark.getRemarks) // 21、获取备注信息

router.get('/user', User.getInfo) // 24、获取用户信息
router.get('/user/:user_id', User.getInfoById) // 
router.get('/users/list', User.getUserList) // 57、获取用户列表
router.get('/users/count', User.getUserCount) // 43、获取所有用户注册量
router.get('/users/:user_id/addresses', Address.getAddress) // 22、获取收货地址列表
router.post('/users/:user_id/addresses', Address.addAddress) // 28、增加收货地址
router.get('/user/city/count', User.getUserCity) // 60、获取用户分布信息
router.get('/address/:address_id', Address.getAddAddressById) // 59、获取地址信息
router.post('/users/:user_id/addresses/:address_id', Address.deleteAddress) // 29、删除收货地址
router.post('/users/:user_id/carts/:cart_id/orders', Order.postOrder) // 30、下单
router.post('/users/:user_id/hongbao/exchange', Hongbao.exchange) // 36、兑换红包
 
export default router