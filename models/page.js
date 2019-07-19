'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const pageSchema = new Schema({
  // 前端界面的   btns:[{name: '', show: false}]
  title: String,
  index: '',
  btns: Array
})

const Page = mongoose.model('Page', pageSchema)

export default Page