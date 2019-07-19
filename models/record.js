'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const recordSchema = new Schema({
    username: String,
    des: String,
    createTime: String,
    opertionText: String
})

const Record = mongoose.model('Record', recordSchema)

export default Record