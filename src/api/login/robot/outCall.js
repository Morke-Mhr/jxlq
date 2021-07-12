import fetch from '../../utils/fetch';
import publicConst from 'utils/public_const';

// 外呼任务列表 start

// 上传号码--保存号码
export function outCall_saveTaskNumber(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/saveTaskNumber',
		method: 'post',
		data: query
	});
}

// 上传号码--号码列表
export function outCall_taskNumberList(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/taskNumberList',
		method: 'post',
		data: query
	});
}

// 上传号码--导入号码验证
export function outCall_check(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/check',
		method: 'post',
		data: query
	});
}

// 上传号码--选择客户
export function outCall_imorptCode_select(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/imorptCode/select',
		method: 'post',
		data: query
	});
}

// 号码管理--删除任务号码
export function outCall_deleteNumber(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/deleteNumber',
		method: 'post',
		data: query
	});
}

// 外呼任务--列表
export function outCall_list(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/list',
		method: 'post',
		data: query
	});
}

// 外呼任务--外显号码
export function number_selectList(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/number/selectList',
		method: 'post',
		data: query
	});
}

// 外呼任务--并发数量
export function outCall_getConcurrentCount(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/getConcurrentCount',
		method: 'post',
		data: query
	});
}

// 外呼任务--新建任务
export function outCall_add(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/add',
		method: 'post',
		data: query
	});
}

// 外呼任务--编辑任务
export function outCall_info(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/info',
		method: 'post',
		data: query
	});
}

// 外呼任务--编辑任务
export function outCall_edit(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/edit',
		method: 'post',
		data: query
	});
}

// 任务详情--任务数据
export function outCall_taskDetail_taskData(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/taskData',
		method: 'post',
		data: query
	});
}

// 任务详情--任务记录基本信息
export function outCall_callRecordInfo(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/callRecordInfo',
		method: 'post',
		data: query
	});
}

// 任务详情--取消任务
export function outCall_cancelTask(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/cancelTask',
		method: 'post',
		data: query
	});
}

// 任务详情--基本信息
export function outCall_basicInfo(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/basicInfo',
		method: 'post',
		data: query
	});
}

// 任务详情--通话列表
export function outCall_callList(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/callList',
		method: 'post',
		data: query
	});
}

// 任务详情--通话记录详情
export function outCall_callRecordList(query) {
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/callRecordList',
		method: 'post',
		data: query
	});
}

// 任务详情--导出通话列表
export function outCall_export(query) {
	let api = 'BASE_API',reHeader = 1;
	return fetch({
		url: publicConst.proxyPathCcs +'/aicall/robot/outCallTask/export',
		method: 'post',
		data: query,
		responseType: 'blob'
	},api,reHeader);
}

// 外呼任务列表 end