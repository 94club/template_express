'use strict';

import ExplainModel from '../../models/v3/explain'

class Explain {
	constructor(){

	}
	async getExpalin(req, res, next){
		try{
			const explain = await ExplainModel.findOne();
			res.json(explain.data)
		}catch(err){
			console.log('获取服务中心数据失败', err);
			res.json({
				status: 0,
				type: 'ERROR_GET_SERVER_DATA',
				message: '获取服务中心数据失败'
			})
		}
	}
}

export default new Explain()