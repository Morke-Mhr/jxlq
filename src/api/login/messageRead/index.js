//消息已读

import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.jurisdiction


//获取列表
export function messageRead(data) {
  console.log("发请求")
//   return request({
//     url: serviceName + '/sysmessage/checkMsg',
//     method: 'post',
//     data
//   })
  return axios.post(store.state.apiConfiguration.url + serviceName + `/sysmessage/checkMsg`,data)
}