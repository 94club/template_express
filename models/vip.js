'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const vipSchema = new Schema({
  username: String,
  password: String,
  id: Number,
  des: {type: String, default: '用户'},
  createTime: String,
  pageList: Array,
  createBy: String
})

const Vip = mongoose.model('Vip', vipSchema)

export default Vip