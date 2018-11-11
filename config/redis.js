import constant from '../constant/constant'
import redis from 'redis'
import chalk from 'chalk'

const redisClient = redis.createClient("6379", "127.0.0.1", {
  auth_pass: "94club"
})

redisClient.on('error', function (err) {
  console.log('redis Error:' + err)
})

redisClient.on('connect', function (err) {
  console.log(
    chalk.green('连接redis成功')
  )
})

function getToken (headers) {
  if (headers && headers.authorization) {
    var authorization = headers.authorization
    var part = authorization.split(' ')
    if (part.length === 2) {
      return part[1]
    } else {
      return null
    }
  } else {
    return null
  }
}

function refreshToken (req, res, next) {
  // TODO 研究一下这里的req,res是哪里来的
  let token = getToken(req.headers)
  redisClient.get(token, (err, reply) => {
    if (reply) {
      // token 在redis中存在，更新过期时间
      redisClient.expire(token, constant.expireTime, function(err, reply) {
        if (err) return false
        console.log('更新token时间成功')
        next()
      })
    } else {
      next({
        status: 401,
        message: '认证失效,重新登录'
      })
    }
  })
}

function set (token) {
  redisClient.set(token, token, function (err, reply) {
    if (err) return false
    console.log(reply)
    if (reply) {
      // 设置过期时间
      redisClient.expire(token, constant.expireTime, function(err, reply) {
        if (err) return false
        console.log('更新token时间成功')
      })
    }
  })
}

function remove (req, next) {
  let token = getToken(req.headers)
  // 删除成功，返回1，否则返回0(对于不存在的键进行删除操作，同样返回0)
  redisClient.del(token, (err, reply) => {
    if (err) {
      next({
        status: 0,
        message: '网络异常'
      })
    }
    console.log('删除token成功')
  })
}

export default {
  refreshToken,
  set,
  remove
}
