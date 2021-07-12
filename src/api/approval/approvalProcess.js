

import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.process


//审批业务查询
export function getApproval(businessKey) {
  return request({
    url: serviceName + `/task/showApplyhistoryBybusinessKey?businessKey=${businessKey}`,
    method: 'get',
  })
}




