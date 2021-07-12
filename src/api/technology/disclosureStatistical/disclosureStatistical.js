import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.technology
//const serviceName = store.state.serviceName.mock


// 获取方案设计列表
export function getLists(pageNum, pageSize,CurrentYear) {

  return request({
    url: serviceName + `/newDisclosureHead/disclosureStatistics?pageNum=${pageNum}&pageSize=${pageSize}&queryYear=${CurrentYear}`,
    method: 'get'
  })
}
//图表
export function getChartData(CurrentYear) {
  return request({
    url: serviceName + `/newDisclosureHead/disclosureStatisticsChart?queryYear=${CurrentYear}`,
    method: 'get'
  })
}
