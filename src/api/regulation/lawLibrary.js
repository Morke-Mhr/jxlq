// 法律法规

import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.regulation
const serviceNameS = store.state.serviceName.jurisdiction
const serviceNameDelete = store.state.serviceName.deleteFs


//获取列表
export function getList(id) {
  console.log("发请求")
  return request({
    url: serviceName + `/lawsDoc/findList?lawTypeIds=${id}`,
    method: 'get',
  })
}

//新增
export function getAddList(data) {
  return request({
    url: serviceName + '/lawsDoc',
    method: 'post',
    data
  })
}
//查询
export function getInquire(pageNum, pageSize,lawName, lawType, resource, status,lawTypeIds) {
  console.log(111,pageNum, pageSize,lawName, lawType, resource, status,lawTypeIds)
  return request({
    url: serviceName + `/lawsDoc/findList?pageNum=${pageNum}&pageSize=${pageSize}&lawName=${lawName}&lawType=${lawType}&resource=${resource}&status=${status}&lawTypeIds=${lawTypeIds}`,
    method: 'get',
  })
}


//查看
export function getCheck(lawdocId) {
  console.log(lawdocId)
  return request({
    url: serviceName + `/lawsDoc/getInfo?lawdocId=${lawdocId}`,
    method: 'get',
  })
}
//修改
export function getChangeList(data) {
  return request({
    url: serviceName + '/lawsDoc',
    method: 'put',
    data
  })
}

//删除
export function getDelete(lawdocId) {
  return request({
    url: serviceName + '/lawsDoc/' + lawdocId,
    method: 'delete',
  })
}

//文件删除
export function fsDelete(fileId) {
  return request({
    url: serviceName + `/lawsDocFile/deleteFile/${fileId}`,
    method: 'delete',
  })
}

//分类查询
export function Classification(dictNumber) {
  return request({
    url: serviceNameS + `/dict/data/dictType/${dictNumber}`,
    method: 'get',
  })
}
//树列表分类
export function getTree() {
  return request({
    url: serviceName + `/lawsDoc/searchWrapper`,
    method: 'get',
  })
}
