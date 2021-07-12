import request from '@/utils/request'
import store from '@/store'

// const serviceName = store.state.serviceName.technology
const serviceName = store.state.serviceName.mock


// 获取需求列表
export function getTechnologyList({pageNum, pageSize}) {
  return request({
    url: serviceName + `/project/list?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  })
}
//安全技术新增表单
export function getAddTech(data) {
  return request({
    url: serviceName + '/project',
    method: 'post',
    data
  })
}
