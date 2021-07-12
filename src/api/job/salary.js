import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.regulation
const serviceNameSystem = store.state.serviceName.jurisdiction


//新增
export function getAddList(data) {
  return request({
    url: serviceName + '/userSalary/addOrUpdate',
    method: 'post',
    data
  })
}
//修改
export function getChangeList(data) {
  return request({
    url: serviceName + '/userSalary/addOrUpdate',
    method: 'post',
    data
  })
}

//删除
export function getDelete(userchangeId) {
  return request({
    url: serviceName + '/userSalary/' + userchangeId,
    method: 'delete',
  })
}
//编辑
export function getCheck(userchangeId) {
  return request({
    url: serviceName + `/userSalary/findById?userchangeId=${userchangeId}`,
    method: 'get',
  })
}


//获取列表
export function getList() {
  console.log("发请求")
  return request({
    url: serviceName + '/userSalary/findList',
    method: 'get',
  })
}

//查询
export function getInquire(pageNum, pageSize,userName, payTime, cardNum, deptName, postName, salaryMonth) {
  return request({
    url: serviceName + `/userSalary/findList?pageNum=${pageNum}&pageSize=${pageSize}&userName=${userName}&payTime=${payTime}&cardNum=${cardNum}&deptName=${deptName}&postName=${postName}&salaryMonth=${salaryMonth}`,
    method: 'get',
  })
}


//部门
export function deptName() {
  return request({
    url: serviceName + `/dict/data/dictType/${dictNumber}`,
    method: 'get',
  })
}

//文件上传
export function Upload() {
  return request({
    url: serviceName + '/yhknowledgeDoc/downloadHiddendangerController',
    method: 'get',
  })
}
//下载模板
export function download() {
  return request({
    url: serviceName + '/userSalary/downLoadTemplate',
    method: 'get',
  })
}

//部门
export function getBranch() {
  return request({
    url: serviceNameSystem + '/dept/treeselect',
    method: 'get'
  })
}
//部门
export function getBranchS() {
  return request({
    url: serviceNameSystem + '/dept/getTreeDeptByLogin',
    method: 'get'
  })
}

//人员
export function getPeople(deptId) {
  return request({
    url: serviceNameSystem + `/user/getUserListByDeptId?deptId=${deptId}`,
    method: 'get'
  })
}
