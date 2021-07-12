import request from '@/utils/request'
import store from '@/store'

const serviceNameA = store.state.serviceName.assessment
const serviceNameP = store.state.serviceName.process
const serviceNameT = store.state.serviceName.task
const serviceNameTec = store.state.serviceName.technology
const serviceName = store.state.serviceName.jurisdiction
const serviceNameS = store.state.serviceName.safetyEdu
// const serviceName = store.state.serviceName.assessment

/**
 * 图表
 */

//领导首页-安全教育统计接口
export function getTrainStatistics() {
  return request({
    url: serviceNameS + '/trainDemand/homePage/trainStatistics',
    method: 'get',
  })
}


//领导首页--安全检查统计（饼状图）
export function getPieSafeCheckStatDataLeader() {
  return request({
    url: serviceNameA + '/safecheck/getPieSafeCheckStatDataLeader',
    method: 'get',
  })
}
//领导首页 - 安全检查统计（柱状图）
export function getBarSafeCheckStatDataLeader() {
  return request({
    url: serviceNameA + '/safecheck/getBarSafeCheckStatDataLeader',
    method: 'get',
  })
}
//领导首页 -- 隐患整改统计（饼状图）
export function getPieYhRectStatDataLeader() {
  return request({
    url: serviceNameA + '/hiddendanger/getPieYhRectStatDataLeader',
    method: 'get',
  })
}
//领导首页 - 隐患治理统计 （柱状图）
export function getBarYhRectStatDataLeader() {
  return request({
    url: serviceNameA + '/hiddendanger/getBarYhRectStatDataLeader',
    method: 'get',
  })
}

//领导首页--责任书签订（饼状图）
export function getPieSafeBookStatDataLeader() {
  return request({
    url: serviceName + '/userSafebook/getPieSafeBookStatDataLeader',
    method: 'get',
  })
}
//领导首页 -责任书签订统计 （柱状图）
export function getBarSafeBookStatDataLeader() {
  return request({
    url: serviceName + '/userSafebook/getBarSafeBookStatDataLeader',
    method: 'get',
  })
}

//领导首页-技术交底统计接口
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
// 获取公告列表
export function getNoticeList(data) {
  return request({
    url: serviceName + '/tbNotice/getNoticesPageMore',
    method: 'get',
    params:data
  })
}
// 领导层、中层、基层--通知公告详情查看
export function oneNotice(noticeId) {
  return request({
    url: serviceName + '/tbNotice/pageShow?noticeId='+noticeId,
    method: 'get',
  })
}