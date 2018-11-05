import jwtAuth from '../config/jwt'
import user from './user'
import unAuth from './unAuth'
import redisManager from '../config/redis'

export default (app) => {
  app.use(jwtAuth) // 验证token的有效性
  app.use('/api', unAuth)
  app.use(redisManager.refreshToken) // 每一次请求都刷新token的过期时间
  app.use('/user', user)
}
