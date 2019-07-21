'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: String,
  password: String,
  id: Number,
  des: String,
  createTime: String,
  role: Number,  // 2管理员 1超级管理员
  routerArr: Array,
  createBy: String
})

const User = mongoose.model('User', userSchema)

export default User