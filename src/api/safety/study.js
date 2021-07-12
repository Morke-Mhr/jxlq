import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.safetyEdu



// 获取当前人自学
export function getStudyList({pageNum, pageSize,pxTitleId,pxClassId}) {
  return request({
    url: serviceName + `/trainDemand/selfStudyVideoList?pageNum=${pageNum}&pageSize=${pageSize}&pxTitleId=${pxTitleId}&pxClassId=${pxClassId}`,
    method: 'get'
  })
}
//获取自学视频及信息
export function getStudyVideo(data){
  return request({
    url:serviceName + '/trainPlan/trainCoursewareList',
    method:'get',
    params:data
  })
}
//效验学习这个课件当前人是否是未看完的
export function getStudyIsEnd(data){
  return request({
    url:serviceName + '/trainStudy/validationVideo',
    method:'get',
    params:data
  })
}
//效验学习的当前人是否满足需求的课时
export function getStudyIsSatisfy (data,id){
  return request({
    url:serviceName + `/trainStudy/validationCoursewareIsEnd?traincoursewareId=${data}&trainplanId=${id ? id : ""}`,
    method:'get',
  })
}
//根据当前人新增培训学习记录
export function getStudyAddRecord (data){
  return request({
    url:serviceName + '/trainStudy/addTrainStudy',
    method:'post',
    data
  })
}
//在线培训l列表点播放视频
export function getOnlineVideo(trainplanId){
  return request({
    url:serviceName + '/trainPlan/getTrainCoursewareInfo/'+trainplanId,
    method:'get',
  })
}
///测试
// export function getNeedList() {
//   return request({
//     url: serviceName + '/demo/gettest',
//     method: 'post'
//   })
// }
