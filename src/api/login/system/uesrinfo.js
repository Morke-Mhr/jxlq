import request from '@/utils/request'
import store from '@/store'

let serviceName = ''
if (store) {
  serviceName = store.state.serviceName.jurisdiction
}

// 查看个人信息
export function getProfilr() {
  return request({
    url: serviceName + '/user/profile',
    method: 'get'
  })
}

// 修改个人信息
export function updateProfilr(data) {
  return request({
    url: serviceName + '/user/profile',
    method: 'put',
    data
  })
}
