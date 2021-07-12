import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.safetyEdu



// 培训统计
export function getStudyData(value) {
  return request({
    url: serviceName + `/trainDemand/trainStatisticsList?queryYear=${value}`,
    method: 'get'
  })
}

