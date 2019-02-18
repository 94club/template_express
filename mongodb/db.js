'use strict'

import mongoose from 'mongoose'
import chalk from 'chalk'
console.log(process.env.NODE_ENV)
console.log(process.env.DB_ADDR)
mongoose.connect(process.env.DB_ADDR, {
  useNewUrlParser: true
})
mongoose.Promise = global.Promise

const db = mongoose.connection
db.once('open', () => {
  console.log(
    chalk.green('连接数据库成功')
  )
})

db.on('error', function (error) {
  console.error(
    chalk.red('Error in MongoDb connection: ' + error)
  )
  mongoose.disconnect()
})

db.on('close', function () {
  console.log(
    chalk.red('数据库断开，重新连接数据库')
  )
  mongoose.connect(config.url, {
    server: {
      auto_reconnect: true
    }
  })
})

export default db
