import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.safetyEdu



// 获取当前人自学
export function getTrainList({pageNum, pageSize,pxTitleId,pxClassId}) {
  return request({
    url: serviceName + `/trainPlan/onlineTrainingVideoList?pageNum=${pageNum}&pageSize=${pageSize}&pxTitleId=${pxTitleId}&pxClassId=${pxClassId}`,
    method: 'get'
  })
}

///测试
// export function getNeedList() {
//   return request({
//     url: serviceName + '/demo/gettest',
//     method: 'post'
//   })
// }
