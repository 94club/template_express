'use strict'

import UserModel from '../models/user'
import RecordModel from '../models/record'
import PageModel from '../models/page'
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
    this.postPage = this.postPage.bind(this)
    this.getPage = this.getPage.bind(this)
    this.deletePage = this.deletePage.bind(this)
    this.putPage = this.putPage.bind(this)
    this.postAdmin = this.postAdmin.bind(this)
    this.getAdmin = this.getAdmin.bind(this)
    this.deleteAdmin = this.deleteAdmin.bind(this)
    this.putAdmin = this.putAdmin.bind(this)
    this.postVip = this.postVip.bind(this)
    this.deleteVip = this.deleteVip.bind(this)
    this.putVip = this.putVip.bind(this)
    this.getVip = this.getVip.bind(this)
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
    let recordInfo = await RecordModel.find({}, { '_id': 0, '__v': 0}).sort({_id: -1})
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

  async postPage (req, res) {
    let data = req.body
    let {name, value, tagList} = data
    try {
      if (!name) {
        throw new Error('界面名称不能为空')
      } else if (!value) {
        throw new Error('界面值不能为空')
      } else if (tagList.length === 0) {
        throw new Error('标签不能为空')
      }
    } catch (err) {
      res.json({
        status: 0,
        message: err.message
      })
      return
    }
    let pageList = await PageModel.find({})
    try {
      PageModel.create({
        id: pageList.length + 1,
        name,
        value,
        tagList
      }, (err) => {
        if (err) {
          console.log('界面写入失败')
          res.json({
            status: 0,
            data: '界面添加失败'
          })
          this.addRecord({
            username: req.user.username,
            des: '超级管理员',
            createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
            opertionText: '超级管理员' + req.user.username + '创建了' + data.name + '界面失败'
          })
        } else {
          res.json({
            status: 200,
            data: '界面添加成功'
          })
          this.addRecord({
            username: req.user.username,
            des: '超级管理员',
            createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
            opertionText: '超级管理员' + req.user.username + '创建了' + data.name + '界面成功'
          })
        }
        console.log(data)
      })
    } catch (err) {
      console.log('日志写入catch失败')
    }
  }

  async deletePage (req, res) {
    let data = res.body
    let {id} = data
    try {
      if (!id) {
        throw new Error('id不能为空')
      }
    } catch (err) {
      res.json({
        status: 0,
        message: err.message
      })
      return
    }
    try {
      PageModel.remove({id}, (err) => {
        if (err) {
          console.log('界面删除失败')
          res.json({
            status: 0,
            data: '界面删除失败'
          })
          this.addRecord({
            username: req.user.username,
            des: '超级管理员',
            createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
            opertionText: '超级管理员' + req.user.username + '删除了' + data.name + '界面失败'
          })
        } else {
          res.json({
            status: 200,
            data: '界面添加成功'
          })
          this.addRecord({
            username: req.user.username,
            des: '超级管理员',
            createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
            opertionText: '超级管理员' + req.user.username + '创建了' + data.name + '界面成功'
          })
        }
        console.log(data)
      })
    } catch (error) {
      console.log('page删除catch失败')
    }
  }

  async putPage (req, res) {}

  async getPage (req, res) {
    let pageInfo = await PageModel.find({}, { '_id': 0, '__v': 0}).sort({_id: -1})
    if (pageInfo) {
      res.json({
        status: 200,
        message: '查询界面成功',
        data: pageInfo
      })
    } else {
      res.json({
        status: 0,
        message: '界面查询失败，请联系管理员'
      })
    }
  }

  async postAdmin (req, res) {}

  async deleteAdmin (req, res) {}

  async putAdmin (req, res) {}

  async getAdmin (req, res) {}

  async postVip (req, res) {}

  async deleteVip (req, res) {}

  async putVip (req, res) {}

  async getVip (req, res) {}

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
