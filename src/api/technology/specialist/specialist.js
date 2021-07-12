import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.technology
// const serviceName = store.state.serviceName.mock


// 获取专家会审列表
export function getSpeciaList({pageNum, pageSize,programName,natureId,categoryId,projectName,bid}) {
  return request({
    url: serviceName + `/expertReview/list?pageNum=${pageNum}&pageSize=${pageSize}&programName=${programName}&natureId=${natureId}&categoryId=${categoryId}&projectName=${projectName}&bid=${bid}`,
    method: 'get'
  })
}
//专家会审新增表单
export function getSpecia(data) {
  return request({
    url: serviceName + '/expertReview',
    method: 'post',
    data
  })
}
//删除
export function getDeleteSpecia(expertreviewId) {
  return request({
    url: serviceName + '/expertReview/' + expertreviewId,
    method: 'delete'
  })
}
//查看
export function getSpeciaDetail(expertreviewId) {
  return request({
    url: serviceName + '/expertReview/' + expertreviewId,
    method: 'get',
  })
}
//编辑
export function getEditItem(data) {
  return request({
    url: serviceName + '/project',
    method: 'put',
    data
  })
}

