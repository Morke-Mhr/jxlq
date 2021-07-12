import request from '@/utils/request'
import store from '@/store'

// const serviceName = store.state.serviceName.mock
const addWorkMockService = store.state.serviceName.addWorkMock
const serviceName = store.state.serviceName.org
const orgMock = store.state.serviceName.orgMock
const bookService = store.state.serviceName.addBook
const wajService = store.state.serviceName.regulation

//机构列表
export function getTreeDeptSelect() {
  return request({
    url: serviceName + '/dept/treePostAndDeptselect',
    method: 'get'
  })
}
//根据登录人来获取部门信息
export function getTreeDeptSelect2() {
  return request({
    url: serviceName + '/dept/getTreeDeptByLogin',
    method: 'get'
  })
}

//新增工作流程图
export function getAddWorkchart(data) {
  return request({
    url: serviceName + '/workProcess/addWorkProcess',
    method: 'post',
    data
  })
}
// 获取工作流程列表
export function getWorkchartList({
  pageNum,
  pageSize,
  name,
  status,
  createBy,
  createByTime
}) {
  return request({
    url:
      serviceName +
      `/workProcess/list?pageNum=${pageNum}&pageSize=${pageSize}&name=${name}&status=${status}&createBy=${createBy}&createByTime=${createByTime}`,
    //url: serviceName + `/workProcess/list?pageNum=${pageNum}&pageSize=${pageSize}&name=${name}&status=${status}&createBy=${createBy}`,
    method: 'get'
  })
}
// 删除工作流程
export function getDelWorkchart(wProcessId) {
  return request({
    url: serviceName + '/workProcess/delete/' + wProcessId,
    method: 'delete'
  })
}
// 查看工作流程
// export function getlookWorkchart(wProcessId) {
//   return request({
//     url: serviceName + '/workProcess/getWorkProcess/'+wProcessId,
//     method: 'get'
//   })
// }
export function getlookWorkchart(workprocessId, params) {
  return request({
    url: serviceName + `/workProcess/getWorkProcess/${workprocessId}`,
    method: 'get',
    params
  })
}
// 提交工作流程
export function getSubmitWorkchart(wProcessId) {
  return request({
    url: serviceName + '/workProcess/submit/' + wProcessId,
    method: 'put'
  })
}
// 编辑工作流程
export function getEditWorkchart(data) {
  return request({
    url: serviceName + '/workProcess/edit',
    method: 'put',
    data
  })
}
//设置岗位
// export function getSetJob(data) {
//   return request({
//     url: serviceName + '/wprocessPost/setPost',
//     method: 'post',
//     data
//   })
// }
export function getSetJob(data) {
  return request({
    url: serviceName + '/wprocessPost/setPost',
    method: 'post',
    data
  })
}
// 点击节点获得岗位
// export function getNodeIdJob(nodeId) {
//   return request({
//     url: serviceName + '/wprocessPost/getWpPost/'+nodeId,
//     method: 'get'
//   })
// }
export function getNodeIdJob(nodeId) {
  return request({
    url: serviceName + '/wprocessPost/getWpPost/' + nodeId,
    method: 'get'
  })
}
// 点击节点获得关联作业指导书
// export function getNodeIdBook(nodeId) {
//   return request({
//     url: serviceName + '/wprocessGuide/getWpPost/'+nodeId,
//     method: 'get'
//   })
// }
export function getNodeIdBook(nodeId, params) {
  return request({
    url: serviceName + '/wprocessGuide/getWpGuide/' + nodeId,
    method: 'get',
    params
  })
}
//新增作业指导书
export function getAddWorkBookList({ pageNum, pageSize, workName, workType }) {
  return request({
    url:
      wajService +
      `/workstandardDoc?pageNum=${pageNum}&pageSize=${pageSize}&workName=${workName}&workType=${workType}`,
    method: 'get'
  })
}
//删除作业指导书
export function getDeleteWorkBook(wprocessGuideId) {
  return request({
    url: serviceName + '/wprocessGuide/delete/' + wprocessGuideId,
    method: 'delete'
  })
}
//列表下载作业指导书附件
export function getDowloadWork({ name, path }) {
  return request({
    url: serviceName + `/fs/download?name=${name}&path=${path}`,
    method: 'get'
  })
}
//保存新增作业指导书
export function getSaveAddWork(data) {
  return request({
    url: serviceName + '/wprocessGuide/setGuide',
    method: 'post',
    data
  })
}
