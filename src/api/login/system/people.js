import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.jurisdiction
// const serviceName = store.state.serviceName.mock


// 获取需求列表
export function getPeopleList({pageNum, pageSize,nickName,phonenumber,deptName}) {
  return request({
    url: serviceName + `/user/getPersonnelAccount?pageNum=${pageNum}&pageSize=${pageSize}&nickName=${nickName}&phonenumber=${phonenumber}&deptName=${deptName}`,
    method: 'get'
  })
}
//人员岗位变更列表
export function getPeopleChange(userId) {
  return request({
    url: serviceName + '/businessPost/getPostAndDept/'+userId,
    method: 'get'
  })
}
//人员台账导出
export function getExportFile(userId) {
  return request({
    url: serviceName + '/user/export',
    method: 'get'
  })
}
//人员台账删除
export function getDeletePeopel(userId) {
  return request({
    url: serviceName + '/user/'+userId,
    method: 'delete'
  })
}
//查看人员台账基本信息
export function getPeopleInfo(userId) {
  return request({
    url: serviceName + '/user/getBaseInfo/'+userId,
    method: 'get'
  })
}
//人员台账新增
export function getAddPeople(data) {
  return request({
    url: serviceName + '/user/add',
    method: 'post',
    data
  })
}
//上传头像接口
export function getAddImg(data) {
  return request({
    url: serviceName + '/fs/upload',
    method: 'post',
    data
  })
}
//人员台账编辑
export function getEditPeople(data) {
  return request({
    url: serviceName + '/user',
    method: 'put',
    data
  })
}
//查看人员台账执照情况
export function getPeopleInfoCer(userId) {
  return request({
    url: serviceName + '/userCertificate/getUserCertificate/'+userId,
    method: 'get'
  })
}
//人员台账导出
export function getExport() {
  return request({
    url: serviceName + '/user/export',
    method: 'get'
  })
}
//获取人员台账的基本信息岗位变更列表
export function getBasicJobList({pageNum, pageSize,userId}) {
  return request({
    url: serviceName + `/userChange/list/${userId}?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  })
}
//添加岗位变更
export function getAddJobChange(data) {
  return request({
    url: serviceName + '/userChange/add',
    method: 'post',
    data
  })
}
