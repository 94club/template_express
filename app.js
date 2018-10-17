import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import path from 'path'
import fs from 'fs'
import FileStreamRotator from 'file-stream-rotator'
import chalk from 'chalk'
import db from './mongodb/db.js' // 声明db文件
import index from './routes/index'
const config = require('config-lite')(__dirname)


var app = express();
app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.Origin || req.headers.origin || 'nianhui')
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  res.header("Access-Control-Allow-Credentials", true) //可以带cookies
	res.header("X-Powered-By", '3.2.1')
	if (req.method == 'OPTIONS') {
    res.send(200)
	} else {
    next()
	}
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));// for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', index); // 给接口加前缀
// var logDirectory = path.join(__dirname, 'log')  日志系统会造成路由错误
// // ensure log directory exists
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
// // create a rotating write stream
// var accessLogStream = FileStreamRotator.getStream({
//   date_format: 'YYYYMMDD',
//   filename: path.join(logDirectory, 'access-%DATE%.log'),
//   frequency: 'daily',
//   verbose: false
// })
// // let accessLogStream = fs.createWriteStream(path.join(__dirname, 'log/access.log'), {flags: 'a'}) // 文件系统 flag 'a' - 打开文件用于追加。如果文件不存在则创建文件
// app.use(morgan('combined'), {stream: accessLogStream})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(config.port, () => {
	console.log(
		chalk.green(`成功监听端口：${config.port}`)
	)
})