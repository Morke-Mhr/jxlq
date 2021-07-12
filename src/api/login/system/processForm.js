import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.jurisdiction
const serviceNameProcess = store.state.serviceName
//测试
const serviceNameProcessTest = store.state.serviceName.process
// safetyEduMock

// 获取所有流程数据
export function getAllProcessList({pageNum, pageSize,name}) {
  return request({
    url: serviceNameProcessTest + `/modeldeployList?pageNum=${pageNum}&pageSize=${pageSize}&name=${name}`,
    method: 'get'
  })
}
// 新增角色表单管理数据
export function getAddRole(data) {
  return request({
    url: serviceNameProcessTest + '/processRole/add',
    method: 'post',
    data
  })
}
// 获取下拉角色列表
export function getSelectRole() {
  return request({
    url: serviceNameProcessTest + '/dept/getRoleList',
    method: 'get'
  })
}
// 获取节点信息
export function getNodeRole(id) {
  return request({
    url: serviceNameProcessTest + '/taskform/processInfo?modelId='+id,
    method: 'get'
  })
}
//查询角色关联数据
export function getQueryRole(id) {
  return request({
    url: serviceNameProcessTest + '/processRole/'+id,
    method: 'get'
  })
}
//查询业务模块部门下拉
export function getBussinessDep() {
  return request({
    url: serviceNameProcessTest + '/dept/getDepList',
    method: 'post'
  })
}
//查询业务模块角色下拉
export function getBussinessRole() {
  return request({
    url: serviceNameProcessTest + '/dept/getRoleList',
    method: 'get'
  })
}
//查询业务模块下拉
export function getBussinessAll() {
  return request({
    url: serviceNameProcessTest + '/business/info',
    method: 'get'
  })
}
//查询业务模块关联数据
export function getQueryBussiness(id) {
  return request({
    url: serviceNameProcessTest + '/processBusiness/'+id,
    method: 'get'
  })
}

//新增修改业务模块关联数据
export function getAddBussiness(data) {
  return request({
    url: serviceNameProcessTest + '/processBusiness/add',
    method: 'post',
    data
  })
}
