import express from 'express'
import Shop from '../controller/shopping/shop'
import Food from '../controller/shopping/food'
import Category from '../controller/shopping/category'
import Check from '../middlewares/check'

const router = express.Router()

router.post('/addshop', Check.checkAdmin, Shop.addShop) // 13、添加餐馆
router.get('/restaurants', Shop.getRestaurants) // 6、获取商铺列表
router.get('/restaurants/count', Shop.getShopCount) // 49、获取餐馆数量
router.post('/updateshop', Check.checkAdmin, Shop.updateshop) // 50、更新餐馆
router.post('/restaurant/:restaurant_id', Check.checkSuperAdmin, Shop.deleteResturant) // 51、删除餐馆
router.get('/restaurant/:restaurant_id', Shop.getRestaurantDetail) // 11、餐馆详情
router.post('/addfood', Check.checkAdmin, Food.addFood) // 15、添加食品
router.get('/getcategory/:restaurant_id', Food.getCategory) // 48、获取店铺食品种类
router.post('/addcategory', Check.checkAdmin, Food.addCategory) // 14、添加食品种类
router.get('/v2/menu', Food.getMenu) // 16、获取食品列表
router.get('/v2/menu/:category_id', Food.getMenuDetail) // 54、获取食品种类详情
router.get('/v2/foods', Food.getFoods) // 52、获取食品列表
router.get('/v2/foods/count', Food.getFoodsCount) // 53、获取食品数量
router.post('/v2/updatefood', Check.checkAdmin, Food.updateFood) // 55、更新食品
router.delete('/v2/food/:food_id', Check.checkSuperAdmin, Food.deleteFood) // 56、删除食品
router.get('/v2/restaurant/category', Category.getCategories) // 8、获取所有商铺分类列表
router.get('/v1/restaurants/delivery_modes', Category.getDelivery) // 9、获取配送方式
router.get('/v1/restaurants/activity_attributes', Category.getActivity) // 10、商家属性活动列表

export default router