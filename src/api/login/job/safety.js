import request from '@/utils/request'
import store from '@/store'

// const serviceName = store.state.serviceName.mock
 const addWorkMockService = store.state.serviceName.addWorkMock
const serviceName = store.state.serviceName.org


// 获取安全责任书列表
export function getSafetyList({pageNum, pageSize,userName,status}) {
  return request({
    url: serviceName + `/userSafebook/list?pageNum=${pageNum}&pageSize=${pageSize}&userName=${userName}&status=${status}`,
    //url: serviceName + `/workProcess/list?pageNum=${pageNum}&pageSize=${pageSize}&name=${name}&status=${status}&createBy=${createBy}`,
    method: 'get'
  })
}
// 查看安全责任书
export function getLookSafety(safebookId) {
  return request({
    url: serviceName + '/userSafebook/getSafeBook/' + safebookId,
    method: 'get'
  })
}
