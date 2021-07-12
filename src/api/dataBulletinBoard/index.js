import request from '@/utils/request'
import store from '@/store'

let trainService = '',
	hideService = '',
	technologyService = '',
	serviceName = ""
if (store) {
	trainService = store.state.serviceName.safetyEdu;
	hideService = store.state.serviceName.assessment;
	technologyService = store.state.serviceName.technology;
	serviceName = store.state.serviceName.jurisdiction;
}
const serviceNameA = store.state.serviceName.technology

export function safetyPerformance(date) {
	return request({
		url: trainService + '/trainDemand/kanbanSafelvzhi',
		method: 'get',
		params: date
	})
}

export function punishmentReward(date) {
	return request({
		url: hideService + '/rewardPunish/dataVisualization/rewardPunishMoneyChart',
		method: 'get',
		params: date
	})
}

export function technicalDisclosureF(date) {
	return request({
		url: technologyService + '/technologyConfess/dataVisualization/technologyConfessChart',
		method: 'get',
		params: date
	})
}

export function safetyEducation(data) {
	return request({
		url: trainService + '/trainDemand/dataVisualization/trainChart',
		method: 'get',
		params: data
	})
}

export function mapData(val) {
	return request({
		url: technologyService + '/project/kanbanMapDatas',
		params: val,
		method: 'get'
	})
}

export function dangerReport(val) {
	return request({
		url: hideService + '/hiddendanger/kanbanYinhuanBaogao',
		params: val,
		method: 'get'
	})
}

export function bottomData(val) {
	return request({
		url: hideService + '/hiddendanger/kanbanFourRoundStat',
		params: val,
		method: 'get'
	})
}

export function userSafebook(val) {
	return request({
		url: serviceName + '/userSafebook/kanbanSafebookLinebarStat',
		params: val,
		method: 'get'
	})
}

//点击地图的信息接口
export function mapStata(val) {
	return request({
		url: serviceNameA + `/project/countByProjectProcess?position=${val}`,
		method: 'get'
	})
}
//点击
export function mapListData(val, pageNum, pageSize, projectProcessId, deptId) {
	return request({
		url: serviceNameA + `/project/ListByProjectProcess?position=${val}&pageNum=${pageNum}&pageSize=${pageSize}&projectProcessId=${projectProcessId}&deptId=${deptId}`,
		method: 'get'
	})
}




import axios from "axios";
//监控
const url = 'http://192.168.12.17:18080'
export const getData = (page, count) => {
	return axios({
		method: "get",
		url: url + `/api/devices?page=${page}&count=${count}`,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
//控制台
export const postControl = (device, channelId, control) => {
	return axios({
		method: "post",
		url: url + `/api/ptz/${device}/${channelId}?control=${control}`,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
//技术交底
export function editor(data) {
	return request({
		url: technologyService + `/newDisclosureHead/KanbanTechnologyConfessChart`,
		method: 'get',
		params: data
	})
}