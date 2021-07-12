import axios from 'axios'
import JSONbig from 'json-bigint'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken, setToken } from '@/utils/auth'
import apiConfiguration from '../store/apiConfiguration.js'

// const current = store.state.apiConfiguration[store.state.now]
// create an axios instance
// axios.headers['Authorization'] = getToken()
const service = axios.create({
  baseURL: '', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 600000, // request timeout
  headers: {
    // application/x-www-form-urlencoded
    //
    'Content-Type': 'application/json;charset=UTF-8'
  },
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    return JSONbig.parse(data)
  }]

})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    //  config.url = apiConfiguration.url + config.url
    // 如果没有设置头信息，则默认设置application/x-www-form-urlencoded;charset=UTF-8
    //多端口兼容
    const gateway = store.state.gateway
    let url = config.url
    let boo = false
    const arrList = Object.keys(gateway)
    for (let i = 0; i < arrList.length; i++) {
      const value = arrList[i]
      if (url.indexOf(value) >= 0) {
        const itme = gateway[value + '']
        url = url.replace(value, itme)
        boo = true
        break
      }
    }
    if (boo) {
      let baseURL = apiConfiguration.url

      baseURL = baseURL.substring(0, baseURL.lastIndexOf(':'))
      config.url = baseURL + url
    } else {
      config.url = apiConfiguration.url + url
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const token = response.headers['authorization']
    console.log(response.headers,response.headers['authorization'],'token')
    if (token) {
      setToken(token)
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code == 500) {
      return router.push('/500');

    }
    if (res.code == 404) {
      return router.push('/404');

    }
    if (res.code !== 200) {
      let message = res.message

      if (res.body) {
        if (typeof res.body === 'string') {
          message = res.body
        }
      }
      if(message==="TOKEN已过期"){
        Message({
          message: "您的会话状态已失效，请重新登录" || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }else{
        Message({
          message: message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      console.error('接口异常：' + response.config.url)
      console.error('异常信息：' + message)
      console.error('错误码为：' + res.code)

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 508 || res.code === 512 || res.code === 514) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }

      if (message === 'TOKEN已过期' || message === 'TOKEN错误' || res.code === 402) {
        // TOKEN已过期
        store.dispatch('user/logout').then(() => {
          router.push(`/login?redirect=${router.fullPath}`)
        })
      }

      return Promise.reject(new Error(message || 'Error'))
    } else {
      return res.body || res.data
    }
  },
  error => {
    console.error('请求异常' + error) // for debug
    Message({
      message: '服务器开小差啦，请稍后再试～',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
