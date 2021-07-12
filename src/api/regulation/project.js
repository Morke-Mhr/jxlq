//工程项目档案库

import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.regulation
const serviceNameL = store.state.serviceName.technology
const serviceNameS = store.state.serviceName.jurisdiction



//获取列表
export function getList(id) {
  console.log("发请求",id)
  return request({
    url: serviceName + `/projectDoc/findAll?ids=${id}`,
    method: 'get',
  })
}
//项目获取
export function getProject() {
  return request({
    url: serviceNameL + '/project/projectList',
    method: 'get',
  })
}
//项目查询
export function ProjectInquire(pageNum, pageSize, projectName, bid,) {
  return request({
    url: serviceNameL + `/project/projectList?pageNum=${pageNum}&pageSize=${pageSize}&projectName=${projectName}&bid=${bid}`,
    method: 'get',
  })
}


//新增
export function getAddList(data) {
  return request({
    url: serviceName + '/projectDoc',
    method: 'post',
    data
  })
}
//查询
export function getInquire(pageNum, pageSize, projectName, bid, docType, docName,ids) {
  return request({
    url: serviceName + `/projectDoc/findAll?pageNum=${pageNum}&pageSize=${pageSize}&projectName=${projectName}&bid=${bid}&docType=${docType}&docName=${docName}&ids=${ids}`,
    method: 'get',
  })
}

//查看
export function getLookList(projectdocId) {
  console.log(projectdocId)
  return request({
    url: serviceName + `/projectDoc/findById?projectdocId=${projectdocId}`,
    method: 'get',
  })
}
//修改
export function getChangeList(data) {
  return request({
    url: serviceName + '/projectDoc',
    method: 'put',
    data
  })
}

//删除
export function getDelete(data) {
  console.log(data)
  return request({
    url: serviceName + '/projectDoc/' + data,
    method: 'delete',
  })
}

//文件删除
export function fsDelete(fileId) {
  return request({
    url: serviceName + `/projectDoc/deletefile/${fileId}`,
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
    url: serviceName + `/projectDoc/searchList`,
    method: 'get',
  })
}

//树形搜索
export function searchTree(name) {
  return request({
    url: serviceName + `projectDoc/searchList?name=${name}`,
    method: 'get',
  })
}
