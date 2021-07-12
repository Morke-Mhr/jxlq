import request from '@/utils/request'
import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'

const serviceName = store.state.serviceName.jurisdiction
//测试
const serviceNameProcessTest = store.state.serviceName.process
const train = store.state.serviceName.safetyEdu
// 获取所有流程数据
export function getAllProcessList({ pageNum, pageSize }) {
  return request({
    url:
      serviceNameProcessTest +
      `/modelList?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  })
}
// 新增表单
export function getAddProcessForm(data) {
  return request({
    url: serviceNameProcessTest + '/createData',
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
    url: serviceNameProcessTest + '/publish?modelId=' + id,
    method: 'get'
  })
}
//撤销 功能
export function getAnnul(id) {
  return request({
    url: serviceNameProcessTest + '/revokePublish?modelId=' + id,
    method: 'get'
  })
}
//挂起 功能
export function getPut(id) {
  return request({
    url: serviceNameProcessTest + '/suspend?modelId=' + id,
    method: 'get'
  })
}
//删除 功能
export function getDelete(id) {
  return request({
    url: serviceNameProcessTest + '/delete?modelId=' + id,
    method: 'get'
  })
}
//编辑 功能
export function getEdit(id) {
  return request({
    url: serviceNameProcessTest + '/delete?modelId=' + id,
    method: 'get'
  })
}
//激活 功能
export function getActive(id) {
  return request({
    url: serviceNameProcessTest + '/activate?modelId=' + id,
    method: 'get'
  })
}
//获取岗位变更的下一个流程节点接口
export function getChangeJobNextNode({ businessCode, userId }) {
  return request({
    url:
      serviceNameProcessTest +
      `/business/getFirstUsertaskNoStart?businessCode=${businessCode}&userId=${userId}`,
    method: 'get'
  })
  // return axios.get(store.state.apiConfiguration.url + serviceNameProcessTest + `/business/getFirstUsertaskNoStart?businessCode=${businessCode}&userId=${userId}`, {
  //   headers: { Authorization: getToken() }
  // })
}
//获取待办任务列表数据
export function getBacklog(params) {
  return request({
    url: serviceNameProcessTest + '/task/tasklist',
    method: 'get',
    params: params
  })
}

//获取已办任务列表数据
export function alreadytasklist(params) {
  return request({
    url: serviceNameProcessTest + '/task/alreadytasklist',
    method: 'get',
    params: params
  })
}
// 获取部门下拉树列表  /dept/treeselect
export function getTreeSelect(paramsData) {
  return request({
    url: serviceName + '/dept/treeselect',
    method: 'get',
    params: paramsData ? paramsData : ''
  })
}
// 根据部门编号获取人员信息副本
export function getUserList(deptId) {
  return request({
    url: serviceName + `/user/getUserListByDeptId?deptId=${deptId}`,
    method: 'get'
  })
}

export function getUsersByDeptId(data) {
  return request({
    url: serviceName + `/user/getUsersByDeptId`,
    method: 'post',
    data
  })
}

// 查询多个部门id下所有岗位
export function getBusinessPostAllByDeptIds(params) {
  console.log(params, 'params')
  return request({
    url: serviceName + `/businessPost/getBusinessPostAllByDeptIds/${params}`,
    method: 'get'
  })
}

// 根据登录人获取本部门所有人员集合
export function getUsersByLoginuser() {
  return request({
    url: serviceName + `/user/getUsersByLoginuser`,
    method: 'get'
  })
}

// 根据用户编号获取人员信息
export function getUsersInform(userId) {
  return request({
    url: serviceName + `/user/${userId}`,
    method: 'get'
  })
}

// 岗位更变--提交流程  /task/submit
export function tSubmit(paramsData) {
  return request({
    url: serviceNameProcessTest + `/task/submit`,
    method: 'get',
    params: paramsData ? paramsData : ''
  })
}

// 查看审批历史记录
export function getApprovalRecord(processInstanceId) {
  return request({
    url:
      serviceNameProcessTest +
      `/task/showApplyhistoryByprocessInstanceId?processInstanceId=${processInstanceId}`,
    method: 'get'
  })
}
// 以图片形式打开流程图，并且高亮指定的节点
export function openProcess(paramsData) {
  return axios.get(
    store.state.apiConfiguration.url + serviceNameProcessTest + `/openProcess`,
    {
      params: paramsData ? paramsData : '',
      responseType: 'arraybuffer',
      headers: { Authorization: getToken() }
    }
  )
}

// 获取指定审批流的下一个用户节点信息--已启动、待处理
export function getNextUsertaskStart(paramsData) {
  return request({
    url: serviceNameProcessTest + `/business/getNextUsertaskStart`,
    method: 'get',
    params: paramsData ? paramsData : ''
  })
}

// 任务审核
export function audit(paramsData) {
  return request({
    url: serviceNameProcessTest + `/task/audit`,
    method: 'post',
    data: paramsData ? paramsData : ''
  })
}

// 流转流程（签收、上报等） - 前提是流程已经发起
export function complete(paramsData) {
  return request({
    url: serviceNameProcessTest + `/task/complete`,
    method: 'get',
    params: paramsData ? paramsData : ''
  })
}
// 业务表单
export function viewBusinessInfo(businessCode, businessKey) {
  return request({
    url:
      serviceNameProcessTest +
      `/task/viewBusinessInfo?businessCode=${businessCode}&businessKey=${businessKey}`,
    method: 'get'
  })
}

// 查询所有的版本管理List
export function versionManagement(params) {
  return request({
    url: serviceName + `/versionManagement/apk/list`,
    method: 'get',
    params: params ? params : ''
  })
}

// apk文件上传
export function apkUpload(data) {
  return request({
    url: serviceName + `/versionManagement/apk/upload`,
    method: 'post',
    data: data ? data : ''
  })
}

export function delUpload(idList) {
  return request({
    url: serviceName + `/versionManagement/apk/${idList}`,
    method: 'delete'
  })
}
//
export function getProcessRoleByModelName(data) {
  return request({
    url: serviceNameProcessTest + `/getProcessRoleByProcessName`,
    method: 'post',
    data
  })
}

