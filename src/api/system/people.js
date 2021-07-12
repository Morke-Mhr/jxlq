import request from '@/utils/request'
import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'

const serviceName = store.state.serviceName.jurisdiction
const serviceNameTrain = store.state.serviceName.safetyEdu
const serviceNameTech = store.state.serviceName.technology
const serviceNameHidden = store.state.serviceName.lw
const serviceNameProcessTest = store.state.serviceName.process
// const serviceName = store.state.serviceName.mock


// 获取需求列表
export function getPeopleList(params) {
  return request({
    url: serviceName + `/user/getPersonnelAccount`,
    method: 'get',
    params
  })
}
//人员岗位变更列表
export function getPeopleChange(userId) {
  return request({
    url: serviceName + '/businessPost/getPostAndDept/'+userId,
    method: 'get'
  })
}
//人员台账导出
export function getExportFile(userId) {
  return request({
    url: serviceName + '/user/export',
    method: 'get'
  })
}
//人员台账删除
export function getDeletePeopel(userId) {
  return request({
    url: serviceName + '/user/'+userId,
    method: 'delete'
  })
}
//查看人员台账基本信息
export function getPeopleInfo(userId) {
  return request({
    url: serviceName + '/user/getBaseInfo/'+userId,
    method: 'get'
  })
}
//人员台账新增
export function getAddPeople(data) {
  return request({
    url: serviceName + '/user/add',
    method: 'post',
    data
  })
}
//上传头像接口
export function getAddImg(data) {
  return request({
    url: serviceName + '/fs/upload',
    method: 'post',
    data
  })
}
//人员台账编辑
export function getEditPeople(data) {
  return request({
    url: serviceName + '/user',
    method: 'put',
    data
  })
}
//查看人员台账执照情况
export function getPeopleInfoCer(userId) {
  return request({
    url: serviceName + '/userCertificate/getUserCertificate/'+userId,
    method: 'get'
  })
}
//人员台账导出
export function getExport() {
  return request({
    url: serviceName + '/user/export',
    method: 'get'
  })
}
//获取人员台账的基本信息岗位变更列表
export function getBasicJobList({pageNum, pageSize,userId}) {
  return request({
    url: serviceName + `/userChange/list/${userId}?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  })
}
//添加岗位变更
export function getAddJobChange(data) {
  return request({
    url: serviceName + '/userChange/add',
    method: 'post',
    data
  })
}
//获取人员台账的基本信息培训情况列表
export function getTrainQkList(data) {
  return request({
    url: serviceNameTrain + '/trainPlan/trainRecordListByUserId',
    method: 'get',
    params:data,
  })
}
//获取人员台账的基本信息安全技术交底
export function getTechList(data) {
  return request({
    url: serviceNameTech + '/technologyConfess/technologyConfessRecordListByUserId',
    method: 'get',
    params:data
  })
}
//获取人员台账的基本信息安全检查
export function getPeoSafetyList(params) {
  return request({
    url: serviceNameHidden + '/safecheck/queryByUser',
    method: 'post',
    params: params
  })
}
//获取人员台账的基本信息隐患整改
export function getPeoHiddenList(params) {
  return request({
    url: serviceNameHidden + '/hiddendanger/rectifyListByUser',
    method: 'post',
    params: params
  })
}
//获取人员台账的基本信息奖罚记录
export function getPeoRewardList(params) {
  return request({
    url: serviceNameHidden + '/rewardPunish/queryByUser',
    method: 'post',
    params: params
  })
}
//获取人员台账的基本信息绩效考核
export function getPeoPerfList(params) {
  return request({
    url: serviceNameHidden + '/monthassessRecord/queryStandardByUser',
    method: 'post',
    params: params
  })
}
//获取岗位变更的下一个流程节点接口
export function getChangeJobNextNodeS({ businessCode, userId }) {
  // return request({
    // url:
    //   serviceNameProcessTest +
    //   `/business/getFirstUsertaskNoStart?businessCode=${businessCode}&userId=${userId}`,
    // method: 'get'
  // })
  return axios.get(store.state.apiConfiguration.url + serviceNameProcessTest + `/business/getFirstUsertaskNoStart?businessCode=${businessCode}&userId=${userId}`, {
    headers: { Authorization: getToken() }

  })
}