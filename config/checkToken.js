import constant from '../constant/constant';
import expressJwt from 'express-jwt'

const jwtAuth = expressJwt({secret: constant.secretKey})

export default jwtAuth
