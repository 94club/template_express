import path from 'path'
import fs from 'fs'
import gm from 'gm'
import fetch from 'node-fetch';

export default class BaseComponent {
	
	constructor () {
		this.uploadImg = this.uploadImg.bind(this)
	}

  async fetch(url = '', data = {}, type = 'GET', resType = 'JSON'){
		type = type.toUpperCase();
		resType = resType.toUpperCase();
		if (type == 'GET') {
			let dataStr = ''; //数据拼接字符串
			Object.keys(data).forEach(key => {
				dataStr += key + '=' + data[key] + '&';
			})

			if (dataStr !== '') {
				dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
				url = url + '?' + dataStr;
			}
		}

		let requestConfig = {
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}

		if (type == 'POST') {
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			})
		}
		let responseJson;
		try {
			const response = await fetch(url, requestConfig);
			if (resType === 'TEXT') {
				responseJson = await response.text();
			}else{
				responseJson = await response.json();
			}
		} catch (err) {
			console.log('获取http数据失败', err);
			throw new Error(err)
		}
		return responseJson
  }
  
	async uploadImg (files, res) {
    return new Promise((resolve, reject) => {
      const hashName = (new Date().getTime() + Math.ceil(Math.random()*10000)).toString(16)
      // imgFile是前端formdata append file时的key
      const extname = path.extname(files.imgFile.name)
      if (!['.jpg', '.jpeg', '.png'].includes(extname)) {
        fs.unlinkSync(files.imgFile.path)
        res.json({
          status: 0,
          message: '文件格式错误'
        })
        return 
      }
      const fullName = hashName + extname
      const repath = './public/img/' + fullName
      try {
        // fs.renameSync(files.imgFile.path, repath)
        //  fs.renameSync create Error: EXDEV: cross-device link not permitted, rename
        let readStream = fs.createReadStream(files.imgFile.path)
        let writeSteam  = fs.createWriteStream(repath)
        readStream.pipe(writeSteam)
        readStream.on('end', function () {
          fs.unlinkSync(files.imgFile.path)
          gm(repath)
            .resize(200, 200, "!")
            .write(repath, async (err) => {
            // if(err){
            // 	console.log('裁切图片失败');
            // 	reject('裁切图片失败');
            // 	return
            // }
            resolve(fullName)
          })
        })
      } catch(err) {
        console.log('保存图片失败', err)
        if (fs.existsSync(repath)) {
          fs.unlinkSync(repath)
        } else {
          fs.unlinkSync(files.imgFile.path)
        }
        reject('保存图片失败')
      }
    })
  }
}