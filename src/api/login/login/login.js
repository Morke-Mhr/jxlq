import request from '@/utils/request'

import store from '@/store'
const serviceName = store.state.serviceName.login

export function loginApi(params) {
  console.log(store,121)
  return request({
     url: serviceName+'/login',
    method: 'post',
    data: params
  })
}

export function getCode(params) {
  return request({
     url: serviceName+'/captchaImage',
    method: 'get',
    params
  })
}
//验证码接口
export function phoneSendsms(data) {
  return request({
     url: serviceName+'/sendVerifycodeSms',
    method: 'post',
    data
  })
}
//手机号码登录
export function phoneLogin(data) {
  return request({
     url: serviceName+'/phoneLogin',
    method: 'post',
    data
  })
}



