import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction

// 查询操作日志
export function getLogininforList({ pageNum, pageSize, userName, ipaddr, status,beginTime,endTime }) {
  return request({
    url: serviceName + `/logininfor/list?pageNum=${pageNum}&pageSize=${pageSize}&userName=${userName}&ipaddr=${ipaddr}&status=${status}&beginTime=${beginTime}&endTime=${endTime}`,
    method: 'get'
  })
}

// 批量删除操作日志
export function cleanLogininfor() {
  return request({
    url: serviceName + '/logininfor/clean',
    method: 'delete'
  })
}

// 清空操作日志
export function deleteLogininfor(logininforIds) {
  return request({
    url: serviceName + `/logininfor/${logininforIds}`,
    method: 'delete'
  })
}
