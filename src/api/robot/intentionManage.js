import fetch from '../../utils/fetch';
import publicConst from 'utils/public_const';

// 意图列表
export function intention_list(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/intention/list',
		method: 'post',
		data: query
	});
}

// 意图管理--删除
export function intention_delete(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/intention/delete',
		method: 'post',
		data: query
	});
}

// 意图管理--新增
export function intention_add(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/intention/add',
		method: 'post',
		data: query
	});
}

// 意图管理--编辑
export function intention_edit(query) {
	return fetch({
		url:  publicConst.proxyPathCcs +'/aicall/intention/edit', 
		method: 'post',
		data: query
	});
}

