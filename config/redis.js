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
      // console.log(reply + 'get')
      // token 在redis中存在，更新过期时间
      redisClient.expire(token, constant.expireTime, function(err, reply) {
        if (err) return false
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

function set (token, username) {
  redisClient.set(token, username, function (err, reply) {
    if (err) return false
    // console.log(reply + 'set')
    if (reply) {
      // 设置过期时间
      redisClient.expire(token, constant.expireTime, function(err, reply) {
        if (err) return false
      })
    }
  })
  // 找到旧的token并删除
  redisClient.get('token_current_' + username, function(err, reply) {
    // reply is null when the key is missing
    if (reply) {
      redisClient.del(reply)
      console.log('delete old')
    }
    // 覆盖旧的token
    redisClient.set('token_current_' + username, token)
  });
  

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
