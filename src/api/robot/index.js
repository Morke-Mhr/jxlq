import fetch from '../../utils/fetch';
import publicConst from 'utils/public_const';

// 机器人列表
export function robotInfo_list_page(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robotInfo/list/page',
		method: 'post',
		data: query
	});
}

// 机器人删除
export function robotInfo_delete(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robotInfo/delete',
		method: 'post',
		data: query
	});
}

// 机器人名称验重
export function robotInfo_checkRobotName(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robotInfo/checkRobotName',
		method: 'post',
		data: query
	});
}

// 机器人新增
export function robotInfo_add(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robotInfo/add',
		method: 'post',
		data: query
	});
}

// 机器人新增第三步，试听接口
export function audition_robotInfo_add(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/audition/robotInfo/add',
		method: 'post',
		data: query
	});
}

// 新建机器人--声色列表
export function audition_getSensual(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/audition/getSensual',
		method: 'post',
		data: query
	});
}

// 机器人新建，流程名称验重接口
export function process_checkProcessName(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/process/checkProcessName',
		method: 'post',
		data: query
	});
}

// 机器人详情
export function robotInfo_getDetail(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robotInfo/getDetail',
		method: 'post',
		data: query
	});
}

// 机器人详情中，流程基本信息详情
export function process_getDetail(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/process/getDetail',
		method: 'post',
		data: query
	});
}

