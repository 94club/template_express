import express from 'express'
import Rating from '../controller/ugc/rating'
const router = express.Router()

router.get('/v2/restaurants/:restaurant_id/ratings', Rating.getRatings) // 17、获取评价信息
router.get('/v2/restaurants/:restaurant_id/ratings/scores', Rating.getScores) // 18、获取评价分数
router.get('/v2/restaurants/:restaurant_id/ratings/tags', Rating.getTags) // 19、获取评价分类

export default router