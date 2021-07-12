//安全检查标准库

import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.regulation
const serviceNameS = store.state.serviceName.jurisdiction


//获取列表
export function getExamineList(id) {
  console.log("发请求",id)
  return request({
    url: serviceName + `/safecheckDoc?ids=${id}`,
    method: 'get',
  })
}

//新增
export function getAddList(data) {
  return request({
    url: serviceName + '/safecheckDoc',
    method: 'post',
    data
  })
}
//查询
export function getInquire(pageNum, pageSize,checkClass,checkType,checkProject,ids) {
  return request({
    url: serviceName + `/safecheckDoc?pageNum=${pageNum}&pageSize=${pageSize}&checkClass=${checkClass}&checkType=${checkType}&checkProject=${checkProject}&ids=${ids}`,
    method: 'get',
  })
}
//查看
export function getCheck(safecheckdocId) {
  console.log(safecheckdocId)
  return request({
    url: serviceName + `/safecheckDoc/findById?safecheckdocId=${safecheckdocId}`,
    method: 'get',
  })
}
//修改
export function getChangeList(data) {
  return request({
    url: serviceName + '/safecheckDoc',
    method: 'put',
    data
  })
}
//删除
export function getDelete(safecheckdocId) {
  return request({
    url: serviceName + '/safecheckDoc?safecheckdocId=' + safecheckdocId,
    method: 'delete',
  })
}

//检查分类

export function getCheckClass(dictNumber) {
  console.log(dictNumber+"检查分类")
  return request({
    url: serviceNameS + `/dict/data/dictType/${dictNumber}`,
    method: 'get',
  })
}
//检查类别
export function getCheckType(dictNumber) {
  return request({
    url: serviceNameS + `/dict/data/dictType/${dictNumber}`,
    method: 'get',
  })
}

//树列表分类
export function getTree() {
  return request({
    url: serviceName + `/safecheckDoc/searchWrapper`,
    method: 'get',
  })
}
