'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const pageSchema = new Schema({
  // 前端界面的   
  name: String,
  value: String,
  tagList: Array,
  id: Number,
  checked: {type: Array, default: []},
  isShow: {type: Boolean, default: false}, // 前端是否显示页面 由checked的length决定
  createTime: String
})

const Page = mongoose.model('Page', pageSchema)

export default Page