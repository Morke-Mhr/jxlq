import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.jurisdiction
const serviceNameProcess = store.state.serviceName
//测试
const serviceNameProcessTest = store.state.serviceName.process

// 获取所有流程数据
export function getAllProcessList({pageNum, pageSize}) {
  return request({
    url: serviceNameProcessTest + `/modelList?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  })
}
// 新增表单
export function getAddProcessForm(data) {
  return request({
     url: serviceNameProcessTest +'/createData',
     //url: serviceNameProcessTest +'/modeler/createPage?name='+name+'&key='+key+'&description='+description+'&reversion='+reversion,
    method: 'post',
    data
  })
}
// 新增跳转绘制流程图页面
export function getProcessMap() {
  return request({
    url: serviceNameProcessTest + '/editor',
    method: 'get'
  })
}
//发布 功能
export function getIssue(id) {
  return request({
    url: serviceNameProcessTest + '/publish?modelId='+id,
    method: 'get'
  })
}
//撤销 功能
export function getAnnul(id) {
  return request({
    url: serviceNameProcessTest + '/revokePublish?modelId='+id,
    method: 'get'
  })
}
//挂起 功能
export function getPut(id) {
return request({
    url: serviceNameProcessTest + '/suspend?modelId='+id,
    method: 'get'
})
}
//删除 功能
export function getDelete(id) {
return request({
    url: serviceNameProcessTest + '/delete?modelId='+id,
    method: 'get'
})
}
//编辑 功能
export function getEdit(id) {
return request({
    url: serviceNameProcessTest + '/delete?modelId='+id,
    method: 'get'
})
}
//激活 功能
export function getActive(id) {
return request({
    url: serviceNameProcessTest + '/activate?modelId='+id,
    method: 'get'
})
}
//获取岗位变更的下一个流程节点接口
export function getChangeJobNextNode({businessCode, userId}) {
  return request({
    url: serviceNameProcessTest + `/business/getFirstUsertaskNoStart?businessCode=${businessCode}&userId=${userId}`,
    method: 'get',
  })
}
//获取待办任务列表数据
export function getBacklog(userId) {
  return request({
    url: serviceNameProcessTest + '/task/tasklist?userId=' + userId,
    method: 'get'
  })
}
