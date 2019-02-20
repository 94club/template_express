;
import VipCart from '../controller/member/vipcart'
import express from 'express'
const router = express.Router();

router.post('/v1/users/:user_id/delivery_card/physical_card/bind', VipCart.useCart)

export default router