import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.safetyEdu



// 获取需求列表
export function getNeedList({pageNum, pageSize,pxTitleId,pxClassId,pxDeptId,pxPostId}) {
  return request({
    url: serviceName + `/trainDemand/list?pageNum=${pageNum}&pageSize=${pageSize}&pxTitleId=${pxTitleId}&pxClassId=${pxClassId}&pxDeptId=${pxDeptId}&pxPostId=${pxPostId}`,
    method: 'get'
  })
}
//  1.6 根据部门岗位查询培训需求
export function getNeedList2(data) {
  return request({
    url: serviceName + "/trainDemand/QueryBydeptPost",
    method: 'get',
    params:data
  })
}
// 1.6 查询
export function getNeedList3(data) {
  return request({
    url: serviceName + "/trainDemand/list",
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
// 新增需求
export function getAddNeed(data) {
  return request({
    url: serviceName + '/trainDemand',
    method: 'post',
    data
  })
}
// 单个新增需求
export function getAddNeed2(data) {
  return request({
    url: serviceName + '/trainDemand/singleAdd',
    method: 'post',
    data
  })
}
//查看接口
export function getNeedDetail(traindemandId) {
    return request({
      url: serviceName + '/trainDemand/'  + traindemandId,
      method: 'get'
    })
}
// 编辑培训需求
export function getEditNeed(data) {
  return request({
    url: serviceName + '/trainDemand/',
    method: 'put',
    data
  })
}
//删除
export function getDeleteNeed(traindemandId) {
  return request({
    url: serviceName + '/trainDemand/' + traindemandId,
    method: 'delete',
  })
}