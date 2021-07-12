import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.technology
//const serviceName = store.state.serviceName.mock
const serviceNameProcessTest = store.state.serviceName.process

// 获取方案设计列表
export function getProgramList({
  pageNum,
  pageSize,
  programName,
  natureId,
  categoryId,
  projectName,
  bid
}) {
  return request({
    url:
      serviceName +
      `/workProgram/list?pageNum=${pageNum}&pageSize=${pageSize}&programName=${programName}&projectName=${projectName}&natureId=${natureId}&categoryId=${categoryId}&bid=${bid}`,
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
    method: 'get'
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
    url: serviceName + '/project/' + projectId,
    method: 'delete'
  })
}
//查看接口
export function getProgramItem(workprogramId) {
  return request({
    url: serviceName + `/workProgram/${workprogramId}`,
    method: 'get'
  })
}
//删除方案设计
export function getDeleteProgram(workprogramId) {
  return request({
    url: serviceName + '/workProgram/' + workprogramId,
    method: 'delete'
  })
}
//下载附件
export function getDowloadAtta(workprogramId) {
  return request({
    url: serviceName + '/fs/download',
    method: 'get'
  })
}
//安全技术新增表单
export function getAddProgram(data, method) {
  return request({
    url: serviceName + '/workProgram',
    method: method ? method : 'post',
    data
  })
}
//安全技术编辑表单
export function getEditProgram(data) {
  return request({
    url: serviceName + '/workProgram',
    method: 'put',
    data
  })
}
//审批流接口
export function getProgramNextNode({ businessCode, userId }) {
  return request({
    url:
      serviceNameProcessTest +
      `/business/getBusinessList?businessCode=${businessCode}&userId=${userId}`,
    method: 'get'
  })
}
