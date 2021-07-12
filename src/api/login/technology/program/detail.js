
import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.technology
 //const serviceName = store.state.serviceName.mock

// 获取方案设计列表
export function getProgramItem(workprogramId) {
    return request({
      url: serviceName + `/workProgram/${workprogramId}`,
      method: 'get'
    })
  }
