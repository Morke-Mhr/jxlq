import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.safetyEdu
const serviceNames = store.state.serviceName.jurisdiction
const imgFileUrl = store.state.apiConfiguration.imgFileUrl

// 获取培训计划列表
export function getPlanList({
	pageNum,
	pageSize,
	pxTitleId,
	pxClassId
}) {
	return request({
		url: serviceName +
			`/trainPlan/list?pageNum=${pageNum}&pageSize=${pageSize}&pxTitleId=${pxTitleId}&pxClassId=${pxClassId}`,
		method: 'get'
	})
}
//查看培训计划接口
export function getPlanDetail(trainplanId) {
	return request({
		url: serviceName + '/trainPlan/' + trainplanId,
		method: 'get'
	})
}
//查看培训计划人员接口
export function getPlanDetailTrainp(trainplanId) {
	return request({
		url: serviceName + '/trainPlan/getUsersByTrainplanId/',
		method: 'get',
		params: trainplanId
	})
}
// 1.6  查看培训计划接口
export function getPlanDetail2(data) {
	return request({
		url: serviceName + '/trainPlan/getPlanMakeList',
		method: 'get',
		params: data
	})
}

// 1.6  查看详情的接口
export function getTrainPlanSumData(data) {
	return request({
		url: serviceName + '/trainPlan/list',
		method: 'get',
		params: data
	})
}
// 1.6  统计
export function getTrainPlanSumData2(data) {
	return request({
		url: serviceName + '/trainPlan/getTrainPlanSumData',
		method: 'get',
		params: data
	})
}
// 1.6  查看台账的接口
export function getTrainPlanAccountList(data) {
	return request({
		url: serviceName + '/trainPlan/getTrainPlanAccountList',
		method: 'get',
		params: data
	})
}
// 1.6 查看台账的统计
export function getTrainPlanAccountSumData(data) {
	return request({
		url: serviceName + '/trainPlan/getTrainPlanAccountSumData',
		method: 'get',
		params: data
	})
}
///测试
// export function getNeedList() {
//   return request({
//     url: serviceName + '/demo/gettest',
//     method: 'post'
//   })
// }
// 新增培训计划
export function getAddPlan(data) {
	return request({
		url: serviceName + '/trainPlan',
		method: 'post',
		data
	})
}
export function trainPlan(data) {
	return request({
		url: serviceName + '/trainPlan',
		method: 'put',
		data
	})
}
// 新增培训计划
export function getModification(data) {
	return request({
		url: serviceName + '/trainDemand',
		method: 'put',
		data
	})
}

// 删除培训计划
export function getDelete(data) {
	return request({
		url: serviceName + '/trainPlan/' + data,
		method: 'delete'
	})
}

// 根据类别id和主题id查询所有培训课件(只含视频)
// export function getTrainBook(data) {
//   return request({
//     url: serviceName + '/trainPlan/trainCoursewareList',
//     method: 'get',
//     params:data
//   })
// }
// export function getTrainBook({pxTitleId,pxClassId}) {
//   return request({
//     url: serviceName + `/trainPlan/trainCoursewareList?pxTitleId=${pxTitleId}&pxClassId=${pxClassId}`,
//     method: 'get'
//   })
// }
export function getTrainBook(data) {
	return request({
		url: serviceName + '/trainPlan/trainCoursewareList',
		method: 'get',
		params: data
	})
}
// export function getTrainBook(data) {
//   return request({
//     url: serviceName + '/trainPlan/trainCoursewareList',
//     method: 'get',
//     params:data
//   })
// }

//根据视频地址获取视频播放时长
export function getVedioTime(data) {
	if (!data) {
		return 0;
	}
	if (data.indexOf('http') == -1) {
		data = imgFileUrl + data;
	}
	//文件服务上的课件，增减文件
	var audio = new Audio(data)
	let duration
	// 元数据已加载
	return new Promise((relove, reject) => {
		audio.addEventListener('loadedmetadata', function (e) {
			duration = showTime(audio.duration)
			relove(duration)
		})
	})

}

//格式化视频时长按照时分秒格式展示
function showTime(val) {
	if (val < 60) {
		return val + '秒'
	} else {
		var min_total = Math.floor(val / 60) // 分钟
		var sec = Math.floor(val % 60) // 余秒
		if (min_total < 60) {
			return min_total + '分钟' + sec + '秒'
		} else {
			var hour_total = Math.floor(min_total / 60) // 小时数
			var min = Math.floor(min_total % 60) // 余分钟

			return hour_total + '小时' + min + '分钟' + sec + '秒'
		}
	}
}
//根据视频地址获取视频播放时长
export function getVedioTimes(data) {
	if (!data) {
		return 0;
	}
	if (data.indexOf('http') == -1) {
		data = imgFileUrl + data;
	}
	//文件服务上的课件，增减文件
	var audio = new Audio(data)
	let duration
	// 元数据已加载
	return new Promise((relove, reject) => {
		audio.addEventListener('loadedmetadata', function (e) {
			duration = showTimes(audio.duration)
			relove(duration)
		})
	})


}
//格式化视频时长按照时分格式展示
function showTimes(val) {
	if (val < 60) {
		return 0.1
	} else {
		var min_total = Math.floor(val / 60) // 分钟
		if (min_total < 60) {
			min_total = Math.round((min_total / 60) * 10) / 10
			return min_total
		} else {
			var hour_total = Math.floor(min_total / 60) // 小时数
			var min = Math.round((min_total % 60) * 10) / 10 // 余分钟

			return hour_total + min
		}
	}
}
// 根据培训主题、培训类别、需求课时查询这个需求（对应一个或多个）部门下面的所有人员信息
export function getUserListByTrainDemand({
	pageNum,
	pageSize,
	pxTitleId,
	pxClassId,
	classHour,
	querykeywords,
	status
}) {
	return request({
		url: serviceName +
			`/trainPlan/getUserListByTrainDemand?pageNum=${pageNum}&pageSize=${pageSize}&pxTitleId=${pxTitleId}&pxClassId=${pxClassId}&classHour=${classHour}&querykeywords=${querykeywords}&status=${status}`,
		method: 'get'
	})
}

//查询所有的培训选人
export function getList(data) {
	return request({
		url: serviceName + '/trainplanSelectUser/list',
		method: 'get',
		params: data
	})
}
//批量或单个新增培训选人
export function getTrainplanSelectUser(data) {
	return request({
		url: serviceName + '/trainplanSelectUser',
		method: 'post',
		data
	})
}
//批量新增培训选人(选择所有人员)
export function trainplanSelectUseraddAll(data) {
	return request({
		url: serviceName + '/trainplanSelectUser/addAll',
		method: 'post',
		data
	})
}
//批量或单个删除培训选人
export function trainplanSelectUserDel(data) {
	return request({
		url: serviceName + '/trainplanSelectUser/' + data,
		method: 'delete'
	})
}
//清空培训选人
export function clearData(data) {
	return request({
		url: serviceName + '/trainplanSelectUser/clearData',
		method: 'get',
		params: data
	})
}

//培训跟踪接口
export function traintrack(data) {
	return request({
		url: serviceName + '/trainPlan/traintrack',
		method: 'get',
		params: data
	})
}
//培训跟踪接口
export function getPostsByDeptId(deptId) {
	return request({
		url: serviceNames + '/businessPost/getPostsByDeptId/' + deptId,
		method: 'get',
	})
}

//培训跟踪-用户详细培训记录
export function getUserInfoM(userId) {
	return request({
		url: serviceName + `/trainPlan/traintrack/getUserInfo?userId=${userId}`,
		method: 'get',
	})
}

//获取人员信息
export function getPersonList(pageNum,pageSize,trainplanId) {
	return request({
		url: serviceName +
			`/trainPlan/getUsersByTrainplanId?pageNum=${pageNum}&pageSize=${pageSize}&trainplanId=${trainplanId}`,
		method: 'get'
	})
}

//获取人员信息
export function getSum (trainplanId) {
	return request({
		url: serviceName +
			`/trainPlan/getUsersStatisticsByTrainplanId?trainplanId=${trainplanId}`,
		method: 'get'
	})
}

//培训跟踪-手机扫描用户详细培训记录
export function getUserInfoMove(userId) {
	return request({
		url: serviceName + `/trainPlan/app/traintrack/getUserInfo?userId=${userId}`,
		method: 'get',
	})
}


