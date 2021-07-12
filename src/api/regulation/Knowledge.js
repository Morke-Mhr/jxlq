import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.regulation
const serviceNameS = store.state.serviceName.jurisdiction

//获取列表
export function getKnowledgeList2(params) {
  console.log(params,'params')
  return request({
    url: serviceName + `/yhknowledgeDoc/findList`,
    method: 'get',
    params
  })
}

//获取列表
export function getKnowledgeList(data) {
  return request({
    url: serviceName + `/yhknowledgeDoc/findList?yhkTypeIds=${data}`,
    method: 'get',
  })
}

//查询
export function getInquire(pageNum, pageSize, yhkLevel, yhkProblem, yhkType,yhkTypeIds) {
  return request({
    url:
      serviceName +
      `/yhknowledgeDoc/findList?pageNum=${pageNum}&pageSize=${pageSize}&yhkLevel=${yhkLevel}&yhkProblem=${yhkProblem}&yhkType=${yhkType}&yhkTypeIds=${yhkTypeIds}`,
    method: 'get'
  })
}

//新增
export function getAddKnowledgeList(data) {
  return request({
    url: serviceName + '/yhknowledgeDoc',
    method: 'post',
    data
  })
}

//查看
export function getCheck(yhknowledgeId) {
  return request({
    url: serviceName + `/yhknowledgeDoc/getInfo?yhknowledgeId=${yhknowledgeId}`,
    method: 'get'
  })
}
//修改
export function getChangeList(data) {
  return request({
    url: serviceName + '/yhknowledgeDoc',
    method: 'put',
    data
  })
}

//删除
export function getDeleteKnowledge(KnowledgedictId) {
  return request({
    url: serviceName + '/yhknowledgeDoc/' + KnowledgedictId,
    method: 'delete'
  })
}
//文件删除
export function fsDelete(fileId) {
  return request({
    url: serviceName + `/yhknowledgeFile/deleteById/${fileId}`,
    method: 'delete'
  })
}

//级别
export function getRank(dictNumber) {
  return request({
    url: serviceNameS + `/dict/data/dictType/${dictNumber}`,
    method: 'get'
  })
}
//三违行为
export function threeViolation(dictNumber) {
  return request({
    url: serviceNameS + `/dict/data/dictType/${dictNumber}`,
    method: 'get'
  })
}

//文件上传
export function Upload() {
  return request({
    url: serviceNameS + '/fs/upload',
    method: 'post'
  })
}

//树列表分类
export function getTree() {
  return request({
    url: serviceName + `/yhknowledgeDoc/searchWrapper`,
    method: 'get',
  })
}
