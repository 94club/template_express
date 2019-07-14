'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: String,
  password: String,
  id: Number,
  createTime: String,
  role: Number,  // 0普通用户 1管理员 2超级管理员
})

const User = mongoose.model('User', userSchema)

export default User