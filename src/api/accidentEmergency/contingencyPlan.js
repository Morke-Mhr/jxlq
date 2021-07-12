// <!-- 应急预案-->

import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.accidentEmergency
const serviceWth = store.state.serviceName.process
const service = store.state.serviceName.jurisdiction

// 修改应急预案+++重新提交
export function updateEmergencyPlan(data) {
  return request({
    url: serviceName + '/emergencyPlan/updateEmergencyPlan',
    method: 'put',
    data
  })
}
//获取列表
export function getList() {
  console.log('发请求')
  return request({
    url: serviceName + '/emergencyPlan/list',
    method: 'get'
  })
}
//新增
export function getAddList(data) {
  return request({
    url: serviceName + '/emergencyPlan/addplan',
    method: 'post',
    data
  })
}
//删除
export function getDelete(data) {
  return request({
    url: serviceName + '/emergencyPlan/' + data,
    method: 'delete'
  })
}
//查询
export function getInquire(
  pageNum,
  pageSize,
  planName,
  planClass,
  createByDept,
  releaseTime,
  createBy
) {
  return request({
    url:
      serviceName +
      `/emergencyPlan/list?pageNum=${pageNum}&pageSize=${pageSize}&planName=${planName}&planClass=${planClass}&createByDept=${createByDept}&releaseTime=${releaseTime}&createBy=${createBy}`,
    method: 'get'
  })
}

//查看，编辑
export function getCheck(emergencyplanId) {
  return request({
    url: serviceName + `/emergencyPlan/${emergencyplanId}`,
    method: 'get'
  })
}

//修改
export function getChangeList(data) {
  return request({
    url: serviceName + '/emergencyPlan/edit',
    method: 'put',
    data
  })
}
//新增备案表单
export function addRecords(data) {
  return request({
    url: serviceName + '/emergencyPlan/add',
    method: 'post',
    data
  })
}

//文件删除
export function fsDelete(fileId) {
  return request({
    url: serviceName + `/workstandardFile/deleteById/${fileId}`,
    method: 'delete'
  })
}
//预案类别
export function Classification(dictNumber) {
  return request({
    url: service + `/dict/data/dictType/${dictNumber}`,
    method: 'get'
  })
}

// 获取审批流
export function getBusinessList(params) {
  return request({
    url: serviceWth + '/business/getBusinessList',
    method: 'get',
    params
  })
}
//部门选择
export function treeselect() {
  return request({
    url: service + '/dept/treeselect',
    method: 'get'
  })
}
