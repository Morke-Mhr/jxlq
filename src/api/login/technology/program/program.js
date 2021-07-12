import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.technology
//const serviceName = store.state.serviceName.mock


// 获取方案设计列表
export function getProgramList({pageNum, pageSize,programName,natureId,categoryId,projectName}) {
  return request({
    url: serviceName + `/workProgram/list?pageNum=${pageNum}&pageSize=${pageSize}&programName=${programName}&projectName=${projectName}&natureId=${natureId}&categoryId=${categoryId}`,
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
//下载附件
export function getDowloadAtta(workprogramId) {
    return request({
      url: serviceName + '/fs/download',
      method: 'get'
    })
  }
