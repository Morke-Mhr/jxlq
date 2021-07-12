import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.task
const systemName = store.state.serviceName.jurisdiction


//我创建的 新增任务
export function addtask(params) {
  return request({
    url: serviceName + '/task',
    method: 'post',
	data:params
  })
}


//我创建的 修改任务
export function puttask(params) {
  return request({
    url: serviceName + '/task',
    method: 'put',
	data:params
  })
}

//查询任务列表 
export function gettask(params) {
  return request({
    url: serviceName + '/task',
    method: 'get',
    params
  })
}

//根据ID查询任务的详细信息
export function gettaskId(taskId) {
  return request({
    url: serviceName + '/task/'+taskId,
    method: 'get',
  })
}

//修改任务状态
export function putTaskStatus(taskId,params) {
  return request({
    url: serviceName + '/task/'+taskId+'/status',
    method: 'put',
    data:params
  })
}

//催办
export function posttaskUrge(params) {
  return request({
    url: serviceName + '/task/taskUrge',
    method: 'post',
    data:params
  })
}

//撤回
export function postRetractTask(params) {
  return request({
    url: serviceName + '/task/retractTask',
    method: 'put',
    data:params
  })
}


//r任务申诉
export function postTaskAppeal(taskId,params) {
  return request({
    url: serviceName + '/checked/'+taskId+'/appeal',
    method: 'post',
    data:params
  })
}

//根据ID删除任务的信息
export function deleteTaskId(taskId) {
  console.log(taskId)
  return request({
    url: serviceName + `/task/${taskId}`,
    method: 'delete',
  })
}

//获取字典门类
export function getSelectType(topicType) {
  return request({
    url: systemName + '/dict/data/dictType/' + topicType,
    method: 'get',
  })
}

// 获取部门下拉树列表  /dept/getTreeDeptByLogin 临时任务，抄送人
export function getTreeDeptByLogin(paramsData) {
  return request({
    url: systemName + '/dept/getTreeDeptByLogin',
    method: 'get',
    params: paramsData ? paramsData : ''
  })
}