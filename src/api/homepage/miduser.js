import request from '@/utils/request'
import store from '@/store'

const serviceNameA = store.state.serviceName.assessment
const serviceNameP = store.state.serviceName.process
const serviceNameT = store.state.serviceName.task
const serviceNameTec = store.state.serviceName.technology
const serviceName = store.state.serviceName.jurisdiction
const serviceNameS = store.state.serviceName.safetyEdu
// const serviceName = store.state.serviceName.assessment



//领导层、中层、基层--待审批数量
export function taskCount() {
    return request({
      url: serviceNameP + '/task/taskCount',
      method: 'get',
    })
  }

//领导层、中层、基层--隐患整改数量统计
export function getYhrectifyCount() {
    return request({
      url: serviceNameA + '/hiddendanger/getYhrectifyCount',
      method: 'get',
    })
  }
//领导层、中层、基层--隐患督办数量统计
export function getYhdubanCount() {
    return request({
      url: serviceNameA + '/hiddendanger/getYhdubanCount',
      method: 'get',
    })
  }
//领导层、中层、基层--待办任务
export function getToTaskCount() {
    return request({
      url: serviceNameT + '/task/getToTaskCount',
      method: 'get',
    })
  }

//领导层、中层、基层--超期任务数量统计
export function getOverTimeTaskCount() {
    return request({
      url: serviceNameT + '/task/getOverTimeTaskCount',
      method: 'get',
    })
  }
//领导层、中层、基层--已完成任务数量统计
export function getfinishedTaskCount() {
    return request({
      url: serviceNameT + '/task/getfinishedTaskCount',
      method: 'get',
    })
  }
//领导层、中层、基层--在办任务数量数量统计
export function getDoingTaskCount() {
    return request({
      url: serviceNameT + '/task/getDoingTaskCount',
      method: 'get',
    })
  }
//领导层、中层、基层--获取特种设备待检测数量
export function getSpecialDevCheckCount() {
    return request({
      url: serviceNameTec + '/specialdevTest/getSpecialDevCheckCount',
      method: 'get',
    })
  }
  // 领导层、中层、基层--通知公告首页8条数据
  export function getNoticesPage() {
    return request({
      url: serviceName + '/tbNotice/getNoticesPage',
      method: 'get',
    })
  }


/**
 * 图表
 */

//中层-领导首页-安全教育统计接口
export function getTrainStatistics() {
  return request({
    url: serviceNameS + '/trainDemand/homePage/trainStatistics',
    method: 'get',
  })
}
//中层首页--安全检查统计（饼状图）
export function getPieSafeCheckStatDataMider() {
  return request({
    url: serviceNameA + '/safecheck/getPieSafeCheckStatDataMider',
    method: 'get',
  })
}
//中层首页 - 安全检查统计（柱状图）
export function getBarSafeCheckStatDataMider() {
  return request({
    url: serviceNameA + '/safecheck/getBarSafeCheckStatDataMider',
    method: 'get',
  })
}
//中层首页 -- 隐患整改统计（饼状图）
export function getPieYhRectStatDataMider() {
  return request({
    url: serviceNameA + '/hiddendanger/getPieYhRectStatDataMider',
    method: 'get',
  })
}
//中层首页 - 隐患治理统计 （柱状图）
export function getBarYhRectStatDataMider() {
  return request({
    url: serviceNameA + '/hiddendanger/getBarYhRectStatDataMider',
    method: 'get',
  })
}

//中层首页--责任书签订（饼状图）
export function getPieSafeBookStatDataMider() {
  return request({
    url: serviceName + '/userSafebook/getPieSafeBookStatDataMider',
    method: 'get',
  })
}
//中层首页 -责任书签订统计 （柱状图）
export function getBarSafeBookStatDataMider() {
  return request({
    url: serviceName + '/userSafebook/getBarSafeBookStatDataMider',
    method: 'get',
  })
}

//中层-领导首页-技术交底统计接口
export function getConfessStatistics() {
    return request({
      url: serviceNameTec + '/technologyConfess/homePage/technologyConfessStatistics',
      method: 'get',
    })
  }
//添加人员公告已阅
export function noticeView(noticeId) {
  return request({
    url: serviceName + `/tbNotice/noticeView?noticeId=${noticeId}`,
    method: 'get',
  })
}
