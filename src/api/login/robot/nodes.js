import fetch from '../../utils/fetch';
import publicConst from 'utils/public_const';

/**
 * 交互流程接口 ----------------------------------------------------------------start
 * 
 * 
 */
let api = 'BASE_API';

// 保存流程视图内容
export function process_saveProcessContent(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/process/saveProcessContent',
		method: 'post',
		data: query
	});
}

// 保存流程视图内容-JSON 版本
export function process_saveProcessViewContent(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/process/saveProcessViewContent',
		method: 'post',
		data: query
	});
}

// 查看流程
export function process_getProcessViewContent(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/process/getProcessViewContent',
		method: 'post',
		data: query
	});
}

// 流程提交审核
export function process_audit(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/process/audit',
		method: 'post',
		data: query
	});
}

// 流程测试——保存
export function processTestTask_add(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/processTestTask/add',
		method: 'post',
		data: query
	});
}

// 流程测试——获取外显码号
export function number_selectList(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/number/selectList',
		method: 'post',
		data: query
	});
}

// 组件 试听接口
export function audition_component(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/audition/component',
		method: 'post',
		data: query
	});
}

// 组件中选择变量List
export function variable_selectList() {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/variable/selectList',
		method: 'post',
	});
}

// 组件默认意图列表
export function intention_getDefaultList(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/intention/getDefaultList',
		method: 'post',
		data: query
	});
}

// 获取意图关键字
export function intention_getKeyword(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/intention/getKeyWord',
		method: 'post',
		data: query
	});
}

// 获取意图关键字
export function msg_template_selectList() {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/msg/template/selectList',
		method: 'post',
	});
}



/**
 * 交互流程接口2 ----------------------------------------------------------------start
 * 
 * 
 */
// 保存并提交流程图
export function flows_viewdata(query) {
	return fetch({
		url: publicConst.proxyPathCcs + `/semantic/flow/flows/${query.flowId}/viewdata`,
		method: 'post',
		data: query
	},api,2);
}

// 临时保存流程图
export function flows_viewdataTemp(query) {
    return fetch({
        url: publicConst.proxyPathCcs + `/semantic/flow/flows/${query.flowId}/viewdata/temp`,
        method: 'post',
        data: query
    }, api, 2);
}

// 加载流程图
export function flows_getViewdata(query) {
	return fetch({
		url: publicConst.proxyPathCcs + `/semantic/flow/flows/${query.flowId}/viewdata`,
		method: 'get',
		data: query
	});
}

// 子流程列表查询
export function flows_childList(query) {
    return fetch({
        url: publicConst.proxyPathCcs + `/semantic/flow/flows/child/list`,
        method: 'get',
        params: query
    });
}