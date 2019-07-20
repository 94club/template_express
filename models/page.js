'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const pageSchema = new Schema({
  // 前端界面的   
  name: String,
  value: String,
  tagList: Array,
  id: Number
})

const Page = mongoose.model('Page', pageSchema)

export default Page