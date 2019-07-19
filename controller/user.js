'use strict'

import UserModel from '../models/user'
import RecordModel from '../models/record'
import dateAndTime from 'date-and-time'
import constant from '../constant/constant'
import jsonwebtoken from 'jsonwebtoken'
import redisManager from '../config/redis'

class User {
  constructor () {
    this.login = this.login.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
    this.getRecord = this.getRecord.bind(this)
    this.logout = this.logout.bind(this)
    this.addAdmin = this.addAdmin.bind(this)
    this.addVip = this.addVip.bind(this)
  }

  async login (req, res) {
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
    // 先查一遍看看是否存在
    let userInfo = await UserModel.findOne({username, password}, {'passowrd': 0, '_id': 0, '__v': 0})
    let token = jsonwebtoken.sign(tokenObj, constant.secretKey)
    if (userInfo) {
      // 用户已存在 去登录
      redisManager.set(token, username)
      res.json({
        status: 200,
        message: '登录成功',
        data: {token, userInfo}
      })
      this.addRecord({
        username,
        des: userInfo.des,
        createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
        opertionText: userInfo.des + '' + username + '登录成功'
      })
    } else {
      let routerArr = [
        {
          title: '超级管理员',
          index: '1',
          menuItems: [
            {
              title: 'record',
              index: 'record',
              btns: []
            },
            {
              title: 'member',
              index: 'member',
              btns: []
            },
            {
              title: 'page',
              index: 'page',
              btns: []
            }
          ]
        }
      ]
      if (username === 'admin') {
        let newUser = {
          username,
          password,
          role: 1,
          des: '超级管理员',
          createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
          id: 1,
          routerArr
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
                data: {token, userInfo:
                  {
                    username,
                    role: 1,
                    createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
                    id: 1,
                    routerArr
                  }
                }
              })
              this.addRecord({
                username,
                des: '超级管理员',
                createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
                opertionText: '超级管理员' + username + '被创建了'
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
          message: '用戶名或密码不正确，请联系管理员'
        })
      }
    }
  }

  async getUserInfo (req, res) {
    let userInfo = await UserModel.findOne({username: req.user.username}, {'_id': 0, '__v': 0, 'password': 0})
    if (userInfo) {
      res.json({
        status: 200,
        message: '查询成功',
        data: userInfo
      })
    } else {
      res.json({
        status: 0,
        message: '用户查询失败，请联系管理员'
      })
    }
  }
  
  async logout (req, res) {
    // 清楚redis中的token
    res.json({
      status: 200,
      data: '退出成功'
    })
    redisManager.remove(req)
  }

  async getRecord (req, res) {
    let recordInfo = await UserModel.find({}, { '_id': 0, '__v': 0})
    if (recordInfo) {
      res.json({
        status: 200,
        message: '查询记录成功',
        data: recordInfo
      })
    } else {
      res.json({
        status: 0,
        message: '用户记录失败，请联系管理员'
      })
    }
  }

  async addAdmin (req, res) {}

  async addVip (req, res) {}

  addRecord (recordText) {
    try {
      RecordModel.create(recordText, (err) => {
        if (err) {
          console.log('日志写入失败')
        } else {
          console.log('日志写入成功')
        }
        console.log(recordText)
      })
    } catch (err) {
      console.log('日志写入catch失败')
    }
  }
}

export default new User()
