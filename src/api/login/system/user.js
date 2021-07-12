import request from '@/utils/request'
import store from '@/store'

let serviceName = ''
if (store) {
  serviceName = store.state.serviceName.jurisdiction
}

export function getInfo() {
  return request({
    // url: serviceName + '/getInfo',
    url: '/getInfo',
    method: 'get'
  })
}

export function getRouters() {
  return request({
    // url: serviceName + '/getRouters',
    url: '/getRouters',
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
export function getUserList({ pageNum, pageSize, userName, nickName, phonenumber, status, beginTime, endTime }) {
  return request({
    url: serviceName + `/user/list?pageNum=${pageNum}&pageSize=${pageSize}&userName=${userName}&nickName=${nickName}&phonenumber=${phonenumber}&status=${status}&beginTime=${beginTime}&endTime=${endTime}`,
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
