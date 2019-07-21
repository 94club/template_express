'use strict'

import UserModel from '../models/user'
import RecordModel from '../models/record'
import PageModel from '../models/page'
import VipModel from '../models/vip'
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
      status: 0,
      res.json({
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
          routerArr,
          createBy: '94club'
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
        tagList,
        createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
      }, (err) => {
        if (err) {
          console.log('界面写入失败')
          res.json({
            status: 0,
            data: '界面添加失败'
          })
          this.addRecord({
            username: req.user.username,
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
    let data = req.query
    console.log(req.query)
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

  async putPage (req, res) {
    let data = req.body
    let {name, value, tagList, id} = data
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
    let updateInfo = await PageModel.update({id}, data)
    if (updateInfo) {
      res.json({
        status: 200,
        data: '界面更新成功'
      })
    } else {
      res.json({
        status: 0,
        message: '界面更新失败，请联系管理员'
      })
    }
  }

  async getPage (req, res) {
    let pageInfo = await PageModel.find({}, { '_id': 0, '__v': 0}).sort({_id: -1}).sort({_id: -1})
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

  async postAdmin (req, res) {
    let data = req.body
    let {username, password} = data
    try {
      if (!username) {
        throw new Error('账号不能为空')
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
    let userList = await UserModel.find({})
    let routerArr = [
      {
        title: '管理员',
        index: '2',
        menuItems: [
          {
            title: 'page',
            index: 'page',
            btns: []
          }
        ]
      }
    ]
    try {
      UserModel.create({
        id: userList.length + 1,
        username,
        password,
        role: 2,
        des: '管理员',
        createBy: req.user.username,
        routerArr,
        createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
      }, (err) => {
        if (err) {
          console.log('管理员添加失败')
          res.json({
            status: 0,
            data: '管理员添加失败'
          })
          this.addRecord({
            username: req.user.username,
            createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
            opertionText: '超级管理员' + req.user.username + '创建' + data.username + '失败'
          })
        } else {
          res.json({
            status: 200,
            data: '管理员添加成功'
          })
          this.addRecord({
            username: req.user.username,
            createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
            opertionText: '超级管理员' + req.user.username + '创建' + data.username + '成功'
          })
        }
        console.log(data)
      })
    } catch (err) {
      console.log('日志写入catch失败')
    }
  }

  async deleteAdmin (req, res) {
    let data = req.query
    console.log(req.query)
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
      UserModel.remove({id}, (err) => {
        if (err) {
          console.log('删除失败')
          res.json({
            status: 0,
            data: '删除失败'
          })
          this.addRecord({
            username: req.user.username,
            createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
            opertionText: '超级管理员' + req.user.username + '删除了' + data.username + '失败'
          })
        } else {
          res.json({
            status: 200,
            data: '删除成功'
          })
          this.addRecord({
            username: req.user.username,
            createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
            opertionText: '超级管理员' + req.user.username + '删除' + data.username + '成功'
          })
        }
        console.log(data)
      })
    } catch (error) {
      console.log('page删除catch失败')
    }
  }
  async putAdmin (req, res) {
    let data = req.body
    let {username, password, id} = data
    try {
      if (!username) {
        throw new Error('账号不能为空')
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
    let updateInfo = await UserModel.update({id}, data)
    if (updateInfo) {
      res.json({
        status: 200,
        data: '界面更新成功'
      })
    } else {
      res.json({
        status: 0,
        message: '界面更新失败，请联系管理员'
      })
    }
  }

  async getAdmin (req, res) {
    let userList = await UserModel.find({}, {'_id': 0, '__v': 0, 'password': 0}).sort({_id: -1})
    if (userList) {
      res.json({
        status: 200,
        message: '查询成功',
        data: userList
      })
    } else {
      res.json({
        status: 0,
        message: '查询失败，请联系管理员'
      })
    }
  }

  async postVip (req, res) {
    let data = req.body
    let {username, password, pageList} = data
    try {
      if (!username) {
        throw new Error('账号不能为空')
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
    let vipList = await VipModel.find({})
    try {
      VipModel.create({
        id: vipList.length + 1,
        username,
        password,
        createBy: req.user.username,
        pageList,
        createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
      }, (err) => {
        if (err) {
          console.log('用户添加失败')
          res.json({
            status: 0,
            data: '用户添加失败'
          })
          this.addRecord({
            username: req.user.username,
            createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
            opertionText: req.user.username + '创建' + data.username + '失败'
          })
        } else {
          res.json({
            status: 200,
            data: '用户添加成功'
          })
          this.addRecord({
            username: req.user.username,
            createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
            opertionText: '超级管理员' + req.user.username + '创建' + data.username + '成功'
          })
        }
        console.log(data)
      })
    } catch (err) {
      console.log('日志写入catch失败')
    }
  }

  async deleteVip (req, res) {
    let data = req.query
    console.log(req.query)
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
      VipModel.remove({id}, (err) => {
        if (err) {
          console.log('删除失败')
          res.json({
            status: 0,
            data: '删除失败'
          })
          this.addRecord({
            username: req.user.username,
            createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
            opertionText: req.user.username + '删除了' + data.username + '失败'
          })
        } else {
          res.json({
            status: 200,
            data: '删除成功'
          })
          this.addRecord({
            username: req.user.username,
            createTime: dateAndTime.format(new Date(), "YYYY/MM/DD HH:mm:ss"),
            opertionText: req.user.username + '删除' + data.username + '成功'
          })
        }
        console.log(data)
      })
    } catch (error) {
      console.log('page删除catch失败')
    }
  }

  async putVip (req, res) {
    let data = req.body
    let {username, password, id} = data
    try {
      if (!username) {
        throw new Error('账号不能为空')
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
    let updateInfo = await VipModel.update({id}, data)
    if (updateInfo) {
      res.json({
        status: 200,
        data: '用户更新成功'
      })
    } else {
      res.json({
        status: 0,
        message: '用户更新失败，请联系管理员'
      })
    }
  }

  async getVip (req, res) {
    let vipList = await VipModel.find({}, {'_id': 0, '__v': 0, 'password': 0}).sort({_id: -1})
    if (vipList) {
      res.json({
        status: 200,
        message: '查询成功',
        data: vipList
      })
    } else {
      res.json({
        status: 0,
        message: '查询失败，请联系管理员'
      })
    }
  }

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
