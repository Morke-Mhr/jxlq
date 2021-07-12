import request from '@/utils/request'
import store from '@/store'

let serviceName = ''
if (store) {
  serviceName = store.state.serviceName.process
}

export function getFormList({
  pageNum,
  pageSize,
  name,
  code,
  status,
  beginTime,
  endTime
}) {
  return request({
    url:
      serviceName +
      `/ctForm/list?pageNum=${pageNum}&pageSize=${pageSize}&name=${name}&code=${code}&status=${status}&beginTime=${beginTime}&endTime=${endTime}`,
    method: 'get'
  })
}

export function addForm(data) {
  return request({
    url: serviceName + `/ctForm`,
    method: 'post',
    data
  })
}
