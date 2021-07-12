//作业标准库

import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.regulation
const serviceNameS = store.state.serviceName.jurisdiction
const serviceNameDelete = store.state.serviceName.deleteFs


//获取列表
export function getList(id) {
  return request({
    url: serviceName + `/workstandardDoc?workTypeIds=${id}`,
    method: 'get',
  })
}
//查看，编辑
export function getCheck(workstandardId) {
  return request({
    url: serviceName + `/workstandardDoc/getInfo?workstandardId=${workstandardId}`,
    method: 'get',
  })
}

//查询
export function getInquire(pageNum, pageSize,workName, workType, createBy,workTypeIds) {
  return request({
    url: serviceName + `/workstandardDoc?pageNum=${pageNum}&pageSize=${pageSize}&workName=${workName}&workType=${workType}&createBy=${createBy}&workTypeIds=${workTypeIds}`,
    method: 'get',
  })
}

//新增
export function getAddList(data) {
  return request({
    url: serviceName + '/workstandardDoc',
    method: 'post',
    data
  })
}
//修改
export function getChangeList(data) {
  console.log(data)
  return request({
    url: serviceName + '/workstandardDoc',
    method: 'put',
    data
  })
}

//删除
export function getDelete(data) {
  console.log(data + "删除了单个")
  return request({
    url: serviceName + '/workstandardDoc/'+data,
    method: 'delete',
  })
}
//文件删除
export function fsDelete(fileId) {
  return request({
    url: serviceName + `/workstandardFile/deleteById/${fileId}`,
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
    url: serviceName + `/workstandardDoc/searchWrapper`,
    method: 'get',
  })
}
