import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.safetyEdu



// 获取当前人自学
// export function getClassTrainList({pageNum, pageSize,dept,userName,place,startTime,endTime}) {
//   return request({
//     url: serviceName + `/trainPlan/onlineTrainingVideoList?pageNum=${pageNum}&pageSize=${pageSize}&dept=${dept}&userName=${userName}&place=${place}&startTime=${startTime}`,
//     method: 'get',
//   })
// }
// 查询班前会列表
 export function getClassTrainList(data) {
   return request({
     url: serviceName + '/preclassMeet/list',
     method: 'get',
    params:data
   })
 }
///测试
// export function getNeedList() {
//   return request({
//     url: serviceName + '/demo/gettest',
//     method: 'post'
//   })
// }
//根据班前会id查询班前会信息
export function getClassTrainDetails(preclassmeetId) {
  return request({
    url: serviceName + '/preclassMeet/' +preclassmeetId,
    method: 'get',
  })
}
// 删除班前会
export function delpreclassMeet(preclassmeetIds) {
  return request({
    url: serviceName + '/preclassMeet/'+preclassmeetIds,
    method: 'DELETE',
  })
}

