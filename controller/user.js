'use strict'

import UserModel from '../models/user'
import dateAndTime from 'date-and-time'
import constant from '../constant/constant'
import jsonwebtoken from 'jsonwebtoken'
import redisManager from '../config/redis'

class User {
  constructor () {
    this.login = this.login.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
    this.logout = this.logout.bind(this)
  }

  async login (req, res) {
    let role = 2 // 1代表超级管理员 2代表管理员
    let username = req.body.username
    let password = req.body.password
    const tokenObj = {
      username
    }
    try {
      if (!username) {
        throw new Error('用户不能为空')
      } else if (!password) {
        throw new Error('密码不能为空')
      }
    } catch (err) {
      res.json({
        status: 0,
        message: err.message
      })
      return
    }
    if (username === 'admin') {
      role = 1
    }
    // 先查一遍看看是否存在
    let user = await UserModel.findOne({username})
    let token = jsonwebtoken.sign(tokenObj, constant.secretKey)
    if (user) {
      // 用户已存在 去登录
      let userInfo = await UserModel.findOne({username}, {'passowrd': 0})
      if (userInfo) {
        redisManager.set(token, username)
        res.json({
          status: 200,
          message: '登录成功',
          data: {token, userInfo}
        })
      } else {
        res.json({
          status: 0,
          message: '登录失败,用户名或密码错误'
        })
      }
    } else {
      if (username === 'admin') {
        let arr = await UserModel.find()
        let newUser = {
          username,
          password,
          role: 1,
          createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
          id: arr.length + 1
        }
        try {
          UserModel.create(newUser, (err) => {
            if (err) {
              res.json({
                status: 0,
                message: '注册失败'
              })
            } else {
              redisManager.set(token, username)
              res.json({
                status: 200,
                message: '注册成功',
                data: {
                  username,
                  role,
                  createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
                  id: arr.length + 1,
                  token
                }
              })
            }
          })
        } catch (err) {
          res.json({
            status: 0,
            message: err.message
          })
        }
      } else {
        res.json({
          status: 0,
          message: '查无此用户，请联系管理员'
        })
      }
    }
  }

  async getUserInfo (req, res) {
    let userInfo = await UserModel.findOne({username: req.user.username}, {'_id': 0, '_v': 0})
    if (userInfo) {
      res.json({
        status: 200,
        message: '查询成功',
        data: userInfo
      })
    } else {
      res.json({
        status: 0,
        message: '查询失败'
      })
    }
  }
  
  async logout (req, res) {
    // 清楚redis中的token
    res.json({
      status: 200,
      message: '登出成功'
    })
    redisManager.remove(req)
  }
}

export default new User()
