import request from '@/utils/request'
import store from '@/store'

let serviceName = ''
if (store) {
  serviceName = store.state.serviceName.jurisdiction
}
const serviceNameR = store.state.serviceName.regulation
const serviceNameA = store.state.serviceName.assessment

export function getInfo() {
  return request({
    url: serviceName + '/getInfo',
    // url: '/getInfo',
    method: 'get'
  })
}

export function getRouters() {
  return request({
    url: serviceName + `/getRouters/${0}`,
    // url: '/getRouters',
    method: 'get'
  })
}

/* 用户信息相关*/

export function addUser(data) {
  return request({
    url: serviceName + '/user/add',
    method: 'post',
    data
  })
}
export function updateUse(data) {
  return request({
    url: serviceName + '/user',
    method: 'put',
    data
  })
}
//重置密码
export function UserPwd(data) {
  return request({
    url: serviceName + '/user/resetPwd',
    method: 'put',
    data
  })
}

export function getUser(userId) {
  return request({
    url: serviceName + `/user/${userId}`,
    method: 'get'
  })
}

export function updateUserStatus(data) {
  return request({
    url: serviceName + '/user/changeStatus',
    method: 'put',
    data
  })
}
export function getUserList({
  pageNum,
  pageSize,
  userName,
  realName,
  phonenumber,
  status,
  beginTime,
  endTime
}) {
  return request({
    url:
      serviceName +
      `/user/list?pageNum=${pageNum}&pageSize=${pageSize}&userName=${userName}&realName=${realName}&phonenumber=${phonenumber}&status=${status}&beginTime=${beginTime}&endTime=${endTime}`,
    method: 'get'
  })
}

export function updateUserPwwd(data) {
  return request({
    url: serviceName + '/user/resetPwd',
    method: 'put',
    data
  })
}

export function deleteUser(userIds) {
  return request({
    url: serviceName + `/user/${userIds}`,
    method: 'delete'
  })
}
export function getUserInfo(userId) {
  return request({
    url: serviceName + `/user/${userId}`,
    method: 'get'
  })
}
//新增岗位
export function getJobs(deptId) {
  return request({
    url: serviceName + '/businessPost/getPostsByDeptId/' + deptId,
    method: 'get'
  })
}
export function getTreeDeptSelect() {
  return request({
    url: serviceName + '/dept/treeselect',
    method: 'get'
  })
}

// 修改岗位变更++在重新提交
export function userChange(data) {
  return request({
    url: serviceName + '/userChange/update',
    method: 'put',
    data
  })
}
//查看
export function getCheck(logTime,userId) {
  return request({
    url: serviceNameR + `/safeLog/getSafelogInfoByLogTimeAndUserId?logTime=${logTime}&userId=${userId}`,
    method: 'get'
  })
}
// 安全奖罚
export function rewardPunishMoneyChart() {
  return request({
    url: serviceNameA + '/rewardPunish/personalCenter/rewardPunishMoneyChart',
    method: 'get',
  })
}
// 安全奖罚
export function assessmentRecordByMonth() {
  return request({
    url: serviceNameA + '/monthassessRecord/personalCenter/assessmentRecordByMonth',
    method: 'get',
  })
}
// 任务统计
export function getMyTaskStatistics(month) {
  return request({
    url: serviceName + `/user/personalCenter/getMyTaskStatistics?month=${month}`,
    method: 'get',
  })
}
