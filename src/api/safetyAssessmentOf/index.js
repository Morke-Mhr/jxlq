import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.assessment  //
const systemName = store.state.serviceName.jurisdiction //系统模块

// 查找部门岗位
export function getTreeDeptSelect() {
  return request({
    url: systemName + '/dept/treePostAndDeptselect',
    method: 'get'
  })
}

// 获取部门下拉树列表 
export function getTreeSelect() {
  return request({
    url: systemName + '/dept/getTreeDeptByLogin',
    method: 'get',
  })
}

// 根据 部门 ID 查1岗位
export function getPostsByDeptId(deptId) {
  return request({
    url: systemName + '/businessPost/getPostsByDeptId/' + deptId,
    method: 'get'
  })
}

// 根据部门编号获取人员信息副本
export function getUserListByDeptId(params){
  return request({
    url: systemName + '/user/getUserListByDeptId',
    method: 'get',
    params: params
  })
}

//获取字典门类
export function getSelectType(topicType) {
  return request({
    url: systemName + '/dict/data/dictType/' + topicType,
    method: 'get',
  })
}
// 岗位安全考核目标全部查询
export function getqueryAll(params) {
  return request({
    url: serviceName + '/assessTarget/queryAll',
    method: 'post',
    params: params
  })
}

// 岗位安全考核目标删除
export function delequeryAll(params) {
  return request({
    url: serviceName + '/assessTarget/deletes',
    method: 'post',
    data: params
  })
}


// 岗位安全考核目标新增
export function addequeryAll(params){
  return request({
    url: serviceName + '/assessTarget/submit',
    method: 'post',
    data: params
  })
}

// 月度安全考核记录全部查询
export function getmonthassessRecord(params){
  return request({
    url: serviceName + '/monthassessRecord/queryAll',
    method: 'post',
    data: params
  })
}
// 月度安全考核记录查看
export function getmossRecordView(params){
  return request({
    url: serviceName + '/monthassessRecord/pc/getAssessRecordsListByMonthassessId',
    method: 'get',
    params: params
  })
}

// 月度安全考核记录删除
export function delmonthassessRecord(params){
  return request({
    url: serviceName + '/monthassessRecord/deletes',
    method: 'post',
    data: params
  })
}

// 安全奖惩全部查询
export function getDisciplinaryRecords(params){
  return request({
    url: serviceName + '/rewardPunish/queryAll',
    method: 'post',
    params: params
  })
}

// 安全奖惩全部删除
export function delDisciplinaryRecords(params){
  return request({
    url: serviceName + '/rewardPunish/deletes',
    method: 'post',
    data:params,
  })
}

// 安全奖惩submit
export function addDisciplinaryRecords(data){
  return request({
    url: serviceName + '/rewardPunish/submit',
    method: 'post',
    data: data
  })
}

//年度目标达标全部查询
export function getyearcompliance(params){
  return request({
    url: serviceName + '/yearcompliance/list',
    method: 'get',
    params: params
  })
}

//年度目标达标详细查询
export function getyearcompliancedetail(params){
  return request({
    url: serviceName + '/year-compliance-detail/list',
    method: 'get',
    params: params
  })
}


// 月度安全考核记录 同步
export function manualTask(data){
  return request({
    url: serviceName + '/monthassessRecord/manualTask',
    method: 'get',
    params: data
  })
}
// 年度安全考核记录 同步
export function yearcompliance(data){
  return request({
    url: serviceName + '/yearcompliance/manualTask',
    method: 'get',
    params: data
  })
}