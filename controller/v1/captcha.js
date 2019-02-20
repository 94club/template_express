'use strict';

import captchapng from 'captchapng';
import CaptchaModel from '../../models/captcha/captcha'

class Captcha {
	constructor(){
		this.getCaptcha = this.getCaptcha.bind(this);
	}
	//验证码
	async getCaptcha(req, res, next){
    	const cap = parseInt(Math.random()*9000+1000);
		const UUID = require('uuid');
    	let uuid = UUID.v1();
    	const p = new captchapng(80,30, cap);
        p.color(0, 0, 0, 0); 
        p.color(80, 80, 80, 255);
        const base64 = p.getBase64();
		CaptchaModel.create({cap, uuid})
        res.json({
			status: 200,
			message: '验证码获取成功',
        	data: {
				baseImg: 'data:image/png;base64,' + base64,
				uuid
			}
        });
	}
}

export default new Captcha()