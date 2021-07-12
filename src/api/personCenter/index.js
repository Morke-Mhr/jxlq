import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction
//重置密码
export function getEditPassword(data) {
  return request({
    url: serviceName + '/user/profile/updatePwd',
    method: 'put',
    data
  })
}
//修改个人信息接口
export function getEditInfo(data) {
  return request({
    url: serviceName + '/user/profile',
    method: 'put',
    data
  })
}
// 查询操作日志
// export function getOperLogList({ pageNum, pageSize, title, operName, businessType, status, beginTime, endTime }) {
//   return request({
//     url: serviceName + `/operLog/list?pageNum=${pageNum}&pageSize=${pageSize}&title=${title}&operName=${operName}&businessType=${businessType}&status=${status}&beginTime=${beginTime}&endTime=${endTime}`,
//     method: 'get'
//   })
// }

// // 批量删除操作日志
// export function cleanOperLog() {
//   return request({
//     url: serviceName + '/operLog/clean',
//     method: 'delete'
//   })
// }

// // 清空操作日志
// export function deleteOperLog(operLogIds) {
//   return request({
//     url: serviceName + `/operLog/${operLogIds}`,
//     method: 'delete'
//   })
// }

// // 获取详情
// export function getOperLogInfo(operId) {
//   return request({
//     url: serviceName + `/operLog/${operId}`,
//     method: 'get'
//   })
// }
