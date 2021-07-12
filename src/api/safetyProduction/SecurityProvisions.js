// <!-- 安全经费计提计划-->

import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.accidentEmergency
const serviceWth = store.state.serviceName.process
const service = store.state.serviceName.jurisdiction
const serviceNameL = store.state.serviceName.technology



//获取列表
export function getList() {
  return request({
    url: serviceName + '/fundPlan/list',
    method: 'get',
  })
}
//新增
export function getAddList(data) {
  return request({
    url: serviceName + '/fundPlan/saveOrUpDate',
    method: 'post',
    data
  })
}
//删除
export function getDelete(data) {
  return request({
    url: serviceName + '/fundPlan/deletes/' + data,
    method: 'delete',
  })
}
//查询
export function getInquire(pageNum, pageSize, fundTypeId, deptName, planTime, projectName, money) {
  return request({
    url: serviceName + `/fundPlan/list?pageNum=${pageNum}&pageSize=${pageSize}&fundTypeId=${fundTypeId}&deptName=${deptName}&planTime=${planTime}&projectName=${projectName}&money=${money}`,
    method: 'get',
  })
}

//查看，编辑
export function getCheck(fundplanId) {
  return request({
    url: serviceName + `/fundPlan/${fundplanId}`,
    method: 'get',
  })
}


//项目获取
export function getProject(data) {
  return request({
    url: serviceNameL + '/project/projectList',
    method: 'get',
    params:data
  })
}

//经费类别
export function Classification(dictNumber) {
  return request({
    url: service + `/dict/data/dictType/${dictNumber}`,
    method: 'get',
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
//根据用户登录名获取部门
export function treeselect() {
  return request({
    url: service + '/dept/getTreeDeptByLogin',
    method: 'get',
  })
}

//获取岗位变更的下一个流程节点接口
export function getChangeJobNextNode(businessCode ) {
  return request({
    url:
    serviceWth +
      `/business/getFirstUsertaskNoStart?businessCode=${businessCode}`,
    method: 'get'
  })
}
