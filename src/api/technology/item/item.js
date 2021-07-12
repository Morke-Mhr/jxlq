import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.technology
// const serviceName = store.state.serviceName.mock


// 获取需求列表
export function getTechnologyList({pageNum, pageSize,projectName,bid,projectTypeId,projectProcessId}) {
  return request({
    url: serviceName + `/newProject/pc/list?pageNum=${pageNum}&pageSize=${pageSize}&projectName=${projectName}&bid=${bid}&projectTypeId=${projectTypeId}&projectProcessId=${projectProcessId}`,
    method: 'get'
  })
}

// 获取技术方案列表
export function getWorkProgramList({pageNum, pageSize,programName,bid}) {
  return request({
    url: serviceName + `/workProgram/list?pageNum=${pageNum}&pageSize=${pageSize}&programName=${programName}&bid=${bid}`,
    method: 'get'
  })
}
//安全技术新增表单
export function getAddTech(data) {
  return request({
    url: serviceName + '/project',
    method: 'post',
    data
  })
}
//查看
export function getItemListDetail(projectId) {
  return request({
    url: serviceName + '/project/' + projectId,
    method: 'get',
  })
}
//编辑
export function getEditItem(data) {
  return request({
    url: serviceName + '/project',
    method: 'put',
    data
  })
}
//删除
export function getDeleteItem(projectId) {
  return request({
    url: serviceName + '/newProject/pc/' + projectId,
    method: 'delete'
  })
}
