import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.technology
//const serviceName = store.state.serviceName.mock

///提交提交
// 获取方案设计列表
export function getConfideList({pageNum, pageSize,jdTypeId,projectName,bid,engineName,jiaodiUser}) {
  return request({
    url: serviceName + `/disclosure/list?pageNum=${pageNum}&pageSize=${pageSize}&jdTypeId=${jdTypeId}&projectName=${projectName}&bid=${bid}&engineName=${engineName}&jiaodiUser=${jiaodiUser}`,
    method: 'get'
  })
}
//删除---技术交底
export function getDeleteConfide(technologyconfessIds) {
  return request({
    url: serviceName + '/disclosure/' + technologyconfessIds,
    method: 'delete'
  })
}

//查看技术交底接口
export function getConfideDetail(technologyconfessId) {
    return request({
      url: serviceName + '/disclosure/'  + technologyconfessId,
      method: 'get'
    })
}
//提交技术交底接口
export function getConfidePut(data) {
    return request({
      url: serviceName + '/disclosure',
      method: 'post',
      data
    })
}

//修改技术交底接口
export function getConfideEdit(data) {
    return request({
      url: serviceName + '/disclosure',
      method: 'put',
      data
    })
}