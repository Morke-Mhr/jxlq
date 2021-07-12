import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.safetyEdu



// 获取需求列表  
export function getNeedList() {
  return request({
    url: serviceName + '/trainDemand/list',
    method: 'get'
  })
}
// 新增需求
export function getAddNeed(data) {
  return request({
    url: serviceName + '/trainDemand',
    method: 'post',
    data
  })
}

