import fetch from '../../utils/fetch';
import publicConst from 'utils/public_const';

// 机器人全局配置保存
export function globalConfig_save(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/globalConfig/robot/save',
		method: 'post',
		data: query
	});
}

// 查询机器人全局配置详情
export function globalConfig_getDetail(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/globalConfig/robot/getDetail',
		method: 'post',
		data: query
	});
}

